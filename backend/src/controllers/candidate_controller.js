const candidateService = require('../services/candidate_service');

async function updateCandidate(req, res, next) {
    try {
        const candidateId = req.params.id;
        const data = req.body;

        const updated = await candidateService.updateCandidate(candidateId, data);
        res.json({ message: 'Candidate updated successfully', candidate: updated });
    } catch (err) {
        next(err);
    }
}

async function createOrUpdateCandidates(req, res, next) {
    try {
        const eventId = parseInt(req.params.eventId);
        const { count } = req.body;

        await candidateService.createOrUpdate(eventId, count);
        res.json({ message: `Candidates synced successfully for event ${eventId}` });
    } catch (err) {
        next(err);
    }
}

// ✅ Get all active candidates for an event
async function getAllCandidatesForEvent(req, res, next) {
    try {
        const eventId = parseInt(req.params.eventId);
        const candidates = await candidateService.findAllByEvent(eventId);
        res.json(candidates);
    } catch (err) {
        next(err);
    }
}

// ✅ Soft delete a candidate
async function deleteCandidate(req, res, next) {
    try {
        const candidateId = req.params.id;
        await candidateService.deleteCandidate(candidateId);
        res.json({ message: 'Candidate soft-deleted successfully' });
    } catch (err) {
        next(err);
    }
}

// ✅ Restore a soft-deleted candidate
async function restoreCandidate(req, res, next) {
    try {
        const candidateId = req.params.id;
        await candidateService.restoreCandidate(candidateId);
        res.json({ message: 'Candidate restored successfully' });
    } catch (err) {
        next(err);
    }
}

module.exports = { 
    updateCandidate, 
    createOrUpdateCandidates, 
    getAllCandidatesForEvent, 
    deleteCandidate,   // added
    restoreCandidate   // added
};
