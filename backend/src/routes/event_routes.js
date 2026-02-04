const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateEvent } = require('../validators/event_validator');
const eventController = require('../controllers/event_controller');

// Create Event
router.post('/', auth, validateEvent, eventController.createEvent);

// Get Event Details
router.get('/:eventId', auth, eventController.getEvent);

// Delete Event
router.delete('/:eventId', auth, eventController.deleteEvent);

// Update Event
router.put('/:eventId', auth, validateEvent, eventController.updateEvent);

module.exports = router;
