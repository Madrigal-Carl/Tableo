const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth");
const competitionScoreController = require("../controllers/competition_score_controller");
const {
  validateCompetitionScores,
} = require("../validators/competition_score_validator");

// Submit scores
router.post(
  "/submit",
  requireAuth,
  validateCompetitionScores,
  competitionScoreController.submitScores,
);

module.exports = router;
