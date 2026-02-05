const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    validateStage,
    validateStageCount
} = require('../validators/stage_validator');
const stageController = require('../controllers/stage_controller');

// Update stage name
router.put('/:id', auth, validateStage, stageController.updateStage);

// Create or update stages by count for an event
router.post('/event/:eventId', auth, validateStageCount, stageController.createOrUpdateStages);

module.exports = router;
