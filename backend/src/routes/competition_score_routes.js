const express = require("express");
const router = express.Router();
const competitionScoreController = require("../controllers/competition_score_controller");
const {
  validateCompetitionScores,
} = require("../validators/competition_score_validator");
const requireJudgeInvitation = require("../middlewares/judge");

// Submit scores
router.post(
  "/submit/:invitationCode",
  requireJudgeInvitation,
  validateCompetitionScores,
  competitionScoreController.submitScores,
);

// Check if judge has completed a category
router.get(
  "/check-category/:invitationCode/:categoryId",
  requireJudgeInvitation,
  competitionScoreController.checkCategoryCompletion,
);

//Check if Judge has completed a category and get all judges status for a category (for waiting overlay)
router.get(
  "/category/:invitationCode/:categoryId/judge-status",
  requireJudgeInvitation,
  competitionScoreController.getJudgeStatuses,
);

module.exports = router;
