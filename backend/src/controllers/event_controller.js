const { get } = require('../routes/event_routes');
const eventService = require('../services/event_service');

async function createEvent(req, res, next) {
    try {
        const userId = req.user.id;
        const event = await eventService.createEvent({
            ...req.body,
            userId,
        });

        res.status(201).json({
            message: 'Event created successfully',
            event,
        });
    } catch (err) {
        next(err);
    }
}

async function getEvent(req, res, next) {
    try {
        const event = await eventService.getEvent(req.params.id, req.user.id);
        res.json(event);
    } catch (err) {
        next(err);
    }
}

async function deleteEvent(req, res, next) {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;

        const result = await eventService.deleteEvent(eventId, userId);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

async function updateEvent(req, res, next) {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;

        const result = await eventService.updateEvent(eventId, userId, req.body);

        res.json({ message: 'Event updated successfully', event: result });
    } catch (err) {
        next(err);
    }
}

module.exports = { createEvent, getEvent, deleteEvent, updateEvent };
