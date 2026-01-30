const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateEvent } = require('../validators/event_validator');
const eventController = require('../controllers/event_controller');

// Create Event
router.post('/', auth, validateEvent, eventController.createEvent);

// Get Event Details
router.get('/:id', auth, eventController.getEvent);

// Delete Event
router.delete('/:id', auth, eventController.deleteEvent);

// Update Event
router.put('/:id', auth, validateEvent, eventController.updateEvent);

module.exports = router;
