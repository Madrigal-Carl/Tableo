const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const {
    validateStage,
    validateStageCount
} = require('../validators/stage_validator');
const stageController = require('../controllers/stage_controller');

// Update stage name
router.put('/:id', requireAuth, validateStage, stageController.updateStage);

// Create or update stages by count for an event
router.post('/event/:eventId', requireAuth, validateStageCount, stageController.createOrUpdateStages);

module.exports = router;
