const sequelize = require('../database/models').sequelize;

const eventRepo = require('../repositories/event_repository');
const stageRepo = require('../repositories/stage_repository');
const judgeRepo = require('../repositories/judge_repository');
const candidateRepo = require('../repositories/candidate_repository');

const crypto = require('crypto');

function generateInvitationCode(length = 6) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^A-Z0-9]/gi, '')
        .substring(0, length)
        .toUpperCase();
}

async function generateUniqueInvitationCode() {
    let code;
    let exists = true;

    while (exists) {
        code = `JDG-${generateInvitationCode(6)}`;
        exists = await judgeRepo.findByInvitationCode(code);
    }

    return code;
}

async function createEvent({
    title,
    description,
    date,
    timeStart,
    timeEnd,
    location,
    rounds,
    judges,
    candidates,
    userId,
}) {
    return sequelize.transaction(async (t) => {
        const event = await eventRepo.create(
            {
                title,
                description,
                date,
                timeStart,
                timeEnd,
                location,
                user_id: userId,
            },
            t
        );

        for (let i = 1; i <= rounds; i++) {
            await stageRepo.create(
                {
                    round: i,
                    event_id: event.id,
                },
                t
            );
        }

        for (let i = 0; i < judges; i++) {
            const invitationCode = await generateUniqueInvitationCode();
            await judgeRepo.create(
                {
                    name: `Judge ${i + 1}`,
                    invitationCode,
                    event_id: event.id,
                },
                t
            );
        }

        for (let i = 0; i < candidates; i++) {
            await candidateRepo.create(
                {
                    name: `Candidate ${i + 1}`,
                    event_id: event.id,
                },
                t
            );
        }

        return event;
    });
}

async function deleteEvent(eventId, userId) {
    try {
        await eventRepo.softDelete(eventId, userId);
        return { message: 'Event deleted successfully' };
    } catch (err) {
        throw err;
    }
}

async function getEvent(eventId, userId) {
    const event = await eventRepo.findByIdWithRelations(eventId);

    if (!event) throw new Error('Event not found');
    if (event.user_id !== userId) throw new Error('Unauthorized');

    return event;
}

async function updateEvent(eventId, userId, payload) {
    return sequelize.transaction(async (t) => {
        const event = await eventRepo.findById(eventId, t);

        if (!event) throw new Error('Event not found');
        if (event.user_id !== userId) throw new Error('Unauthorized');

        await eventRepo.update(eventId, payload, t);

        await syncCandidates(eventId, payload.candidates, t);
        await syncJudges(eventId, payload.judges, t);
        await syncStages(eventId, payload.rounds, t);

        return event;
    });
}

async function syncCandidates(eventId, newCount, transaction) {
    const existing = await candidateRepo.findByEvent(eventId, transaction);
    const currentCount = existing.length;

    if (newCount > currentCount) {
        // ➕ CREATE
        const toCreate = newCount - currentCount;

        for (let i = 0; i < toCreate; i++) {
            await candidateRepo.create(
                {
                    name: `Candidate ${currentCount + i + 1}`,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    if (newCount < currentCount) {
        // ➖ SOFT DELETE (LAST ONES)
        const toDelete = currentCount - newCount;

        const lastCandidates = existing
            .slice(-toDelete); // last N

        for (const candidate of lastCandidates) {
            await candidate.destroy({ transaction });
        }
    }
}

async function syncJudges(eventId, newCount, transaction) {
    const existing = await judgeRepo.findByEvent(eventId, transaction);
    const currentCount = existing.length;

    if (newCount > currentCount) {
        const toCreate = newCount - currentCount;

        for (let i = 0; i < toCreate; i++) {
            const invitationCode = await generateUniqueInvitationCode();

            await judgeRepo.create(
                {
                    name: `Judge ${currentCount + i + 1}`,
                    invitationCode,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    if (newCount < currentCount) {
        const toDelete = currentCount - newCount;

        const lastJudges = existing.slice(-toDelete);

        for (const judge of lastJudges) {
            await judge.destroy({ transaction });
        }
    }
}

async function syncStages(eventId, newRounds, transaction) {
    const existing = await stageRepo.findByEvent(eventId, transaction);
    const currentRounds = existing.length;

    if (newRounds > currentRounds) {
        const toCreate = newRounds - currentRounds;

        for (let i = 0; i < toCreate; i++) {
            await stageRepo.create(
                {
                    round: currentRounds + i + 1,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    if (newRounds < currentRounds) {
        const toDelete = currentRounds - newRounds;

        const lastStages = existing.slice(-toDelete);

        for (const stage of lastStages) {
            await stage.destroy({ transaction });
        }
    }
}

module.exports = { createEvent, getEvent, deleteEvent, updateEvent };
