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

module.exports = { createEvent };
