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
    const { count } = req.body;

    await candidateService.createOrUpdate(eventId, count);
    res.json({
      message: `Candidates synced successfully for event ${eventId}`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateCandidate, createOrUpdateCandidates };
