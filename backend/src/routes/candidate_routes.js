const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/auth');
const { validateCandidate, validateCandidateCount } = require('../validators/candidate_validator');
const candidateController = require('../controllers/candidate_controller');
const upload = require('../middlewares/candidate_uploads'); // your multer config

// Update candidate attributes (with optional image upload)
router.put(
    '/:id',
    requireAuth,
    upload.single('photo'), // <- handle 'photo' file upload
    validateCandidate,
    candidateController.updateCandidate
);

// Create or update candidates by count for an event
router.post(
    '/event/:eventId',
    requireAuth,
    validateCandidateCount,
    candidateController.createOrUpdateCandidates
);

// Get all candidates for an event
router.get(
    '/event/:eventId',
    requireAuth,
    candidateController.getAllCandidatesForEvent
);

// Soft delete a candidate
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        await candidateController.deleteCandidate(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Restore a candidate (optional route)
router.post('/:id/restore', requireAuth, candidateController.restoreCandidate);

module.exports = router;
