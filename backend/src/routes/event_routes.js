const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCreateEvent, validateUpdateEvent } = require('../validators/event_validator');
const eventController = require('../controllers/event_controller');

// Create Event
router.post('/', auth, validateCreateEvent, eventController.createEvent);

// Get Event Details
router.get('/:eventId', auth, eventController.getEvent);

// Delete Event
router.delete('/:eventId', auth, eventController.deleteEvent);

// Update Event
router.put('/:eventId', auth, validateUpdateEvent, eventController.updateEvent);

module.exports = router;
