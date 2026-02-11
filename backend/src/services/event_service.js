const sequelize = require('../database/models').sequelize;

const eventRepo = require('../repositories/event_repository');
const stageService = require('./stage_service');
const candidateService = require('./candidate_service');
const judgeService = require('./judge_service');
const { isEventEditable } = require('../utils/event_time_guard');

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

    if (!event) throw new Error('Event not found');
    if (event.user_id !== userId) throw new Error('Unauthorized');

    return event;
}

function normalizeTime(t) {
    if (!t) return null;
    return t.length === 5 ? `${t}:00` : t; // "HH:mm" → "HH:mm:00"
}

async function updateEvent(eventId, userId, payload) {
    return sequelize.transaction(async (t) => {
        const event = await eventRepo.findByIdWithRelations(eventId, t);

        if (!event) throw new Error('Event not found');
        if (event.user_id !== userId) throw new Error('Unauthorized');

        // ⛔ Lock editing once event has started
        if (!isEventEditable({
            date: event.date,
            timeStart: event.timeStart,
        })) {
            const err = new Error('Event has already started and can no longer be edited');
            err.status = 403;
            throw err;
        }

        const incomingTimeStart = normalizeTime(payload.timeStart);
        const existingTimeStart = normalizeTime(event.timeStart);

        const eventHasStarted = !isEventEditable({
            date: event.date,
            timeStart: event.timeStart,
        });

        if (
            eventHasStarted &&
            incomingTimeStart &&
            incomingTimeStart !== existingTimeStart
        ) {
            const err = new Error('Event start time cannot be modified after the event has started');
            err.status = 400;
            throw err;
        }

        if (eventHasStarted) {
            delete payload.timeStart;
        }

        await eventRepo.update(eventId, payload, t);

        await candidateService.createOrUpdate(eventId, payload.candidates, t);
        await judgeService.createOrUpdate(eventId, payload.judges, t);
        await stageService.createOrUpdate(eventId, payload.stages, t);

        const updated = await eventRepo.findByIdWithRelations(eventId, t);

        return {
            ...updated.toJSON(),
            stages: updated.stages.length,
            judges: updated.judges.length,
            candidates: updated.candidates.length,
        };
    });
}

async function getAllEvents(userId) {
    const events = await eventRepo.findByUser(userId);

    return events.map(ev => ({
        ...ev.toJSON(),
        stages: ev.stages.length,
        judges: ev.judges.length,
        candidates: ev.candidates.length,
    }));
}

module.exports = { createEvent, getEvent, deleteEvent, updateEvent, getAllEvents };
