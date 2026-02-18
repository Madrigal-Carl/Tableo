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

module.exports = router;
