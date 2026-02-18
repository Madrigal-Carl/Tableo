const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const { validateCandidate, validateCandidateCount } = require('../validators/candidate_validator');
const candidateController = require('../controllers/candidate_controller');

// Update candidate attributes
router.put('/:id', requireAuth, validateCandidate, candidateController.updateCandidate);

// Create or update candidates by count for an event
router.post('/event/:eventId', requireAuth, validateCandidateCount, candidateController.createOrUpdateCandidates);

// Get all candidates for an event
router.get('/event/:eventId', requireAuth, candidateController.getAllCandidatesForEvent);

// Soft delete a candidate
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const candidateId = req.params.id;
        await candidateController.deleteCandidate(req, res, next); // call controller
    } catch (err) {
        next(err);
    }
});

module.exports = router;