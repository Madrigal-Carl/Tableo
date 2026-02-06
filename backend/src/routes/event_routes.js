const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { validateEvent } = require('../validators/event_validator');
const eventController = require('../controllers/event_controller');

// Create Event
router.post('/', requireAuth, upload.single('image'), validateEvent, eventController.createEvent);

// Get Event Details
router.get('/:eventId', requireAuth, eventController.getEvent);

// Delete Event
router.delete('/:eventId', requireAuth, eventController.deleteEvent);

// Update Event
router.put('/:eventId', requireAuth, upload.single('image'), validateEvent, eventController.updateEvent);

module.exports = router;
