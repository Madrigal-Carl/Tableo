const candidateService = require('../services/candidate_service');
const path = require('path');
const fs = require('fs');

// Update a candidate with optional image upload
async function updateCandidate(req, res, next) {
    try {
        const candidateId = req.params.id;
        const data = {
            name: req.body.name,
            sex: req.body.sex,
            suffix: req.body.suffix, // optional, if you added it
        };

        // Handle uploaded file
        if (req.file) {
            data.path = `/backend/uploads/candidate/${req.file.filename}`; // must match model

            // Optionally delete old file
            const candidate = await candidateService.findCandidateById(candidateId);
            if (candidate && candidate.path) {
                const oldFile = path.join(__dirname, '..', candidate.path);
                if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
            }
        }

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

async function getAllCandidatesForEvent(req, res, next) {
    try {
        const eventId = parseInt(req.params.eventId);
        const candidates = await candidateService.findAllByEvent(eventId);
        res.json(candidates);
    } catch (err) {
        next(err);
    }
}

async function deleteCandidate(req, res, next) {
    try {
        const candidateId = req.params.id;
        await candidateService.deleteCandidate(candidateId);
        res.json({ message: 'Candidate soft-deleted successfully' });
    } catch (err) {
        next(err);
    }
}

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
    deleteCandidate,   
    restoreCandidate   
};
