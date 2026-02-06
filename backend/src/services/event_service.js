const sequelize = require('../database/models').sequelize;

const eventRepo = require('../repositories/event_repository');
const stageService = require('./stage_service');
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
    stages,
    judges,
    candidates,
    userId,
    path,
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
                path,
                user_id: userId,
            },
            t
        );

        await stageService.createOrUpdate(event.id, stages, t);
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
        await stageService.createOrUpdate(eventId, payload.stages, t);

        return event;
    });
}

module.exports = { createEvent, getEvent, deleteEvent, updateEvent };
