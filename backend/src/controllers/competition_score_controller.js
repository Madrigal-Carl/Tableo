const competitionScoreService = require("../services/competition_score_service");

/**
 * GET /scores/category/:categoryId
 */
async function getScoresByCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const scores = await competitionScoreService.getScoresByCategory(categoryId);
    res.status(200).json({ scores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to get scores" });
  }
}

/**
 * GET /scores/candidate/:candidateId
 */
async function getScoresByCandidate(req, res) {
  try {
    const { candidateId } = req.params;
    const categoryIds = req.query.categoryIds
      ? req.query.categoryIds.split(",").map(Number)
      : [];
    const scores = await competitionScoreService.getScoresByCandidate(candidateId, categoryIds);
    res.status(200).json({ scores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to get candidate scores" });
  }
}

/**
 * POST /:categoryId/scores
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

    const response = results.map(r => ({
      category_id: r.category_id,
      candidate_id: r.candidate_id,
      criterion_id: r.criterion_id,
      judge_id: r.judge_id,
      score: r.score,
    }));

    res.status(201).json({ message: "Scores saved successfully", scores: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to save scores" });
  }
}

/**
 * PUT /:categoryId/scores
 */
async function updateBulkScores(req, res) {
  try {
    const { scores, categoryId } = req.body;
    const judgeId = req.user.id;

    const results = await competitionScoreService.setBulkScores({
      categoryId,
      judgeId,
      scores,
    });

    const response = results.map(r => ({
      category_id: r.category_id,
      candidate_id: r.candidate_id,
      criterion_id: r.criterion_id,
      judge_id: r.judge_id,
      score: r.score,
    }));

    res.status(200).json({ message: "Scores updated successfully", scores: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to update scores" });
  }
}

// Export all handlers
module.exports = {
  addOrUpdateBulkScores,
  updateBulkScores,
  getScoresByCategory,
  getScoresByCandidate,
};
