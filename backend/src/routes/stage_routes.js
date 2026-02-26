const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth");
const {
  validateStage,
  validateStageCount,
  validateStageIdParam,
  validateNextStageInput,
} = require("../validators/stage_validator");
const stageController = require("../controllers/stage_controller");

// Create or update stages by count for an event
router.post(
  "/event/:eventId",
  requireAuth,
  validateStageCount,
  stageController.createOrUpdateStages,
);

// Update stage
router.put("/:id", requireAuth, validateStage, stageController.updateStage);

// Get stage result summary
router.get(
  "/:id/results",
  requireAuth,
  validateStageIdParam,
  stageController.getStageResults,
);

// Advance top candidates to next stage
router.post(
  "/:id/advance",
  requireAuth,
  validateStageIdParam,
  validateNextStageInput,
  stageController.advanceStageCandidates,
);

// Get active stage for an event
router.get(
  "/events/:eventId/active-stage",
  stageController.getActiveStageController,
);

// Get overall stage ranking (sum of category averages)
router.get(
  "/:id/overall-results",
  requireAuth,
  validateStageIdParam,
  stageController.getStageOverallResults,
);

module.exports = router;
