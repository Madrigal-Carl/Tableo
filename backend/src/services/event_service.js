const sequelize = require('../database/models').sequelize;

const eventRepo = require('../repositories/event_repository');
const stageRepo = require('../repositories/stage_repository');
const candidateService = require('./candidate_service');
const judgeService = require('./judge_service');

const crypto = require('crypto');

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

        await judgeService.createOrUpdate(event.id, judges, t);
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
        await judgeService.createOrUpdate(eventId, payload.judges, t);
        await syncStages(eventId, payload.rounds, t);

        return event;
    });
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
