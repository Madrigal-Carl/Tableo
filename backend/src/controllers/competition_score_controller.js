const competitionScoreService = require("../services/competition_score_service");

async function submitScores(req, res, next) {
  try {
    const scores = req.body; // array of scores
    const result = await competitionScoreService.submitScores(scores);
    res.status(200).json({ message: "Scores submitted successfully", result });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitScores };
