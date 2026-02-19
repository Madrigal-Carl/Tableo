const candidateService = require("../services/candidate_service");

async function updateCandidate(req, res, next) {
  try {
    const candidateId = req.params.id;
    const data = req.body;

    const updated = await candidateService.updateCandidate(candidateId, data);
    res.json({ message: "Candidate updated successfully", candidate: updated });
  } catch (err) {
    next(err);
  }
}

async function createOrUpdateCandidates(req, res, next) {
  try {
    const eventId = parseInt(req.params.eventId);

    const result = await candidateService.syncCandidates(eventId);

    res.json({
      message: `Candidate added successfully for event ${eventId}`,
      before: result.before,
      after: result.after,
      candidates: result.candidates,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCandidate(req, res, next) {
  try {
    const candidateId = parseInt(req.params.id);

    const result = await candidateService.deleteCandidate(candidateId);

    res.json({
      message: "Candidate deleted successfully",
      candidates: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateCandidate, createOrUpdateCandidates, deleteCandidate };
