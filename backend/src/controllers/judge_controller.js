const judgeService = require('../services/judge_service');

async function updateJudge(req, res, next) {
  try {
    const invitationCode = req.params.invitationCode;
    const data = req.body;

    const updatedJudges = await judgeService.updateJudge(invitationCode, data);
    const updatedJudge = updatedJudges.find(j => j.invitationCode === invitationCode);

    res.json({
      message: 'Judge updated successfully',
      judge: updatedJudge,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteJudge(req, res, next) {
  try {
    const judgeId = parseInt(req.params.judgeId);

    const updatedJudges = await judgeService.deleteJudge(judgeId);

    res.json({
      message: "Judge deleted successfully",
      judges: updatedJudges,
    });
  } catch (err) {
    next(err);
  }
}

async function createOrUpdateJudges(req, res, next) {
    try {
        const eventId = parseInt(req.params.eventId);
        const { count } = req.body;

        await judgeService.createOrUpdate(eventId, count);

        res.json({
            message: `Judges synced successfully for event ${eventId}`,
        });
    } catch (err) {
        next(err);
    }
}

async function getEventForJudge(req, res, next) {
  try {
    const result = await judgeService.getEventForJudge(req);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { updateJudge, createOrUpdateJudges, getEventForJudge, deleteJudge };
