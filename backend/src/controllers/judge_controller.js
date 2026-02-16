const judgeService = require('../services/judge_service');

async function updateJudge(req, res, next) {
    try {
        const invitationCode = req.params.invitationCode;
        const data = req.body;

        const updated = await judgeService.updateJudge(invitationCode, data);

        res.json({
            message: 'Judge updated successfully',
            judges: updated,
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

module.exports = { updateJudge, createOrUpdateJudges, getEventForJudge  };
