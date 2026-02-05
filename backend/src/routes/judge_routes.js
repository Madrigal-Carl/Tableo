const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    validateJudge,
    validateJudgeCount
} = require('../validators/judge_validator');
const judgeController = require('../controllers/judge_controller');

// Update judge attributes
router.put('/:id', auth, validateJudge, judgeController.updateJudge);

// Create or update judges by count for an event
router.post('/event/:eventId', auth, validateJudgeCount, judgeController.createOrUpdateJudges);

module.exports = router;
