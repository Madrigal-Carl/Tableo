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

async function checkCategoryCompletion(req, res, next) {
  try {
    const { invitationCode, categoryId } = req.params;
    const judgeId = req.judge.id; // assume `req.judge` from middleware
    const isCompleted = await competitionScoreService.hasCompletedCategory(
      judgeId,
      categoryId,
    );
    res.status(200).json({ completed: isCompleted });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitScores, checkCategoryCompletion };
