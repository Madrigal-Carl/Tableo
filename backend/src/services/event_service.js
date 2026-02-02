const sequelize = require('../database/models').sequelize;

const eventRepo = require('../repositories/event_repository');
const stageRepo = require('../repositories/stage_repository');
const judgeRepo = require('../repositories/judge_repository');
const candidateService = require('./candidate_service');

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

        await candidateService.createOrUpdate(event.id, candidates, t);

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
    console.log("Event from DB:", event ? event.toJSON() : null);

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

        await candidateService.createOrUpdate(eventId, payload.candidates, t);
        await syncJudges(eventId, payload.judges, t);
        await syncStages(eventId, payload.rounds, t);

        return event;
    });
}

async function syncJudges(eventId, newCount, transaction) {
    const allJudges = await judgeRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    for (let i = 1; i <= newCount; i++) {
        let judge = allJudges.find(j => j.name === `Judge ${i}`);

        if (judge) {
            if (judge.deletedAt) {
                await judge.restore({ transaction });
            }
        } else {
            const invitationCode = await generateUniqueInvitationCode();

            await judgeRepo.create(
                {
                    name: `Judge ${i}`,
                    invitationCode,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    for (const judge of allJudges) {
        const index = parseInt(judge.name.replace("Judge ", ""), 10);
        if (index > newCount && !judge.deletedAt) {
            await judge.destroy({ transaction });
        }
    }
}

async function syncStages(eventId, newRounds, transaction) {
    const allStages = await stageRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    const stageByRound = new Map();
    for (const stage of allStages) {
        stageByRound.set(stage.round, stage);
    }

    // Ensure required rounds exist
    for (let round = 1; round <= newRounds; round++) {
        const stage = stageByRound.get(round);

        if (stage) {
            if (stage.deletedAt) {
                await stage.restore({ transaction });
            }
        } else {
            await stageRepo.create(
                { round, event_id: eventId },
                transaction
            );
        }
    }

    // Soft delete extra rounds
    for (const stage of allStages) {
        if (stage.round > newRounds && !stage.deletedAt) {
            await stage.destroy({ transaction });
        }
    }
}

module.exports = { createEvent, getEvent, deleteEvent, updateEvent };
