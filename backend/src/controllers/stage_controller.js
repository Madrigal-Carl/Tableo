const stageService = require('../services/stage_service');

async function updateStage(req, res, next) {
    try {
        const stageId = req.params.id;
        const data = req.body;

        const updated = await stageService.updateStage(stageId, data);

        res.json({
            message: 'Stage updated successfully',
            stages: updated,
        });
    } catch (err) {
        next(err);
    }
}

async function createOrUpdateStages(req, res, next) {
    try {
        const eventId = parseInt(req.params.eventId);
        const { count } = req.body;

        await stageService.createOrUpdate(eventId, count);

        res.json({
            message: `Stages synced successfully for event ${eventId}`,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { updateStage, createOrUpdateStages };
