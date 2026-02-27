const express = require("express");
const router = express.Router();
const {
  validateJudge,
  validateJudgeCount,
  validateInvitationCode,
  validateStageId,
} = require("../validators/judge_validator");
const judgeController = require("../controllers/judge_controller");
const requireJudgeInvitation = require("../middlewares/judge");
const requireAuth = require("../middlewares/auth");

// Update judge attributes
router.put(
  "/me/:invitationCode",
  requireJudgeInvitation,
  validateInvitationCode,
  validateJudge,
  judgeController.updateJudge,
);

// Create or update judges by count for an event
router.post(
  "/event/:eventId",
  requireAuth,
  validateJudgeCount,
  judgeController.createOrUpdateJudges,
);

// Public access via invitation code
router.get(
  "/event/:invitationCode",
  requireJudgeInvitation,
  validateInvitationCode,
  judgeController.getEventForJudge,
);

// Soft delete a judge
router.delete("/:judgeId", requireAuth, judgeController.deleteJudge);

// Check if ready to proceed to next stage
router.get(
  "/:invitationCode/:stageId/ready",
  requireJudgeInvitation,
  validateStageId,
  judgeController.checkReadyForNextStage,
);

module.exports = router;
