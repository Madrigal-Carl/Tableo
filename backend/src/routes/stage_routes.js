const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth");
const {
  validateStage,
  validateStageCount,
  validateStageIdParam,
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

module.exports = router;
