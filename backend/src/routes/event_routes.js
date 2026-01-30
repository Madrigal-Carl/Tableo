const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { validateCreateEvent } = require('../validators/event_validator');
const eventController = require('../controllers/event_controller');

router.post('/', auth, validateCreateEvent, eventController.createEvent);
router.get('/:id', auth, eventController.getEvent);

module.exports = router;
