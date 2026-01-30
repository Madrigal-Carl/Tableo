const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCreateEvent } = require('../validators/event_validator');
const eventController = require('../controllers/event_controller');

// Create Event
router.post('/', auth, validateCreateEvent, eventController.createEvent);

// Get Event Details
router.get('/:id', auth, eventController.getEvent);

// Delete Event
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;
