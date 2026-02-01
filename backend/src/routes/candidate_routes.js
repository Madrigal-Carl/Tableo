const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { validateCandidate, validateCandidateCount } = require('../validators/candidate_validator');
const candidateController = require('../controllers/candidate_controller');

// Update candidate attributes
router.put('/:id', auth, validateCandidate, candidateController.updateCandidate);

// Create or update candidates by count for an event
router.post('/event/:eventId', auth, validateCandidateCount, candidateController.createOrUpdateCandidates);

module.exports = router;
