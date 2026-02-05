const judgeService = require('../services/judge_service');

async function updateJudge(req, res, next) {
    try {
        const judgeId = req.params.id;
        const data = req.body;

        const updated = await judgeService.updateJudge(judgeId, data);

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

module.exports = { updateJudge, createOrUpdateJudges };
