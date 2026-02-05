const competitionScoreService = require("../services/competition_score_service");

/**
 * POST /:categoryId/scores
 * Body: { scores: [ { candidateId, criterionId, score }, ... ] }
 * Judge ID is taken from logged-in user (req.user.id)
 */
async function addOrUpdateBulkScores(req, res) {
  try {
    const { scores, categoryId } = req.body;
    const judgeId = req.user.id;

    const results = await competitionScoreService.setBulkScores({
      categoryId,
      judgeId,
      scores,
    });

    // Only return the fields needed by frontend
    const response = results.map(r => ({
      category_id: r.category_id,
      candidate_id: r.candidate_id,
      criterion_id: r.criterion_id,
      judge_id: r.judge_id,
      score: r.score,
    }));

    res.status(200).json({ message: "Scores saved successfully", scores: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to save scores" });
  }
};

module.exports = {
  addOrUpdateBulkScores,
};
