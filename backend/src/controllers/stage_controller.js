const stageService = require("../services/stage_service");

async function updateStage(req, res, next) {
  try {
    const stageId = req.params.id;
    const data = req.body;

    const updated = await stageService.updateStage(stageId, data);

    res.json({
      message: "Stage updated successfully",
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

async function getStageResults(req, res, next) {
  try {
    const stageId = parseInt(req.params.id);

    const result = await stageService.getStageResults(stageId);

    res.json({
      message: "Stage results fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function advanceStageCandidates(req, res, next) {
  try {
    const stageId = parseInt(req.params.id);
    const { maleCount, femaleCount } = req.body;

    const result = await stageService.advanceCandidates(
      stageId,
      maleCount,
      femaleCount,
    );

    res.json({
      message: "Candidates advanced to next stage successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function getActiveStageController(req, res) {
  try {
    const eventId = req.params.eventId;

    const stage = await stageService.getActiveStage(eventId);

    res.json({
      message: "Active stage fetched successfully",
      data: stage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  updateStage,
  createOrUpdateStages,
  getStageResults,
  advanceStageCandidates,
  getActiveStageController,
};
