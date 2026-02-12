const eventService = require('../services/event_service');
const { isEventEditable } = require('../utils/event_time_guard');

async function createEvent(req, res, next) {
    try {
        const userId = req.user.id;

        const event = await eventService.createEvent({
            ...req.body,
            path: req.file ? `/uploads/events/${req.file.filename}` : null,
            userId,
        });

        const io = req.app.get('io');
        io.emit('events:updated', { userId });

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
        const event = await eventService.getEvent(req.params.eventId, req.user.id);
        res.json(event);
    } catch (err) {
        next(err);
    }
}

async function deleteEvent(req, res, next) {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;

        const result = await eventService.deleteEvent(eventId, userId);

        const io = req.app.get('io');
        io.emit('events:updated', { userId });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

async function updateEvent(req, res, next) {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;

        const payload = {
            ...req.body,
            ...(req.file && { path: `/uploads/events/${req.file.filename}` }),
        };

        const result = await eventService.updateEvent(eventId, userId, payload);

        const io = req.app.get('io');
        io.emit('events:updated', { userId });

        res.json({ message: 'Event updated successfully', event: result });
    } catch (err) {
        next(err);
    }
}

async function getAllEvents(req, res, next) {
    try {
        const userId = req.user.id;
        const events = await eventService.getAllEvents(userId);
        res.json({ events });
    } catch (err) {
        next(err);
    }
}

async function getDeletedEvents(req, res, next) {
    try {
        const userId = req.user.id;
        const events = await eventService.getDeletedEvents(userId);

        res.json({ events });
    } catch (err) {
        next(err);
    }
}

module.exports = { createEvent, getEvent, deleteEvent, updateEvent, getAllEvents, getDeletedEvents, };
