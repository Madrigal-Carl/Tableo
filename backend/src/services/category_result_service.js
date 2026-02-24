const {
  CompetitionScore,
  CategoryResult,
  Candidate,
  Criterion,
  Category,
} = require("../database/models");
const { Op } = require("sequelize");

async function generateCategoryResults(categoryId) {
  // 1. Fetch category, candidates, and criteria
  const category = await Category.findByPk(categoryId);
  if (!category) throw new Error("Category not found");

  const candidates = await Candidate.findAll({
    where: { event_id: category.event_id },
    attributes: ["id", "name"],
  });

  const criteria = await Criterion.findAll({
    where: { category_id: categoryId },
    attributes: ["id", "percentage"],
  });

  // 2. Fetch all scores for this category
  const scores = await CompetitionScore.findAll({
    where: {
      criterion_id: { [Op.in]: criteria.map((c) => c.id) },
      candidate_id: { [Op.in]: candidates.map((c) => c.id) },
    },
    attributes: ["candidate_id", "judge_id", "criterion_id", "score"],
    raw: true,
  });

  // Map: judge_id => candidate_id => {criterion_id: score}
  const judgeMap = {};
  scores.forEach((s) => {
    if (!judgeMap[s.judge_id]) judgeMap[s.judge_id] = {};
    if (!judgeMap[s.judge_id][s.candidate_id])
      judgeMap[s.judge_id][s.candidate_id] = {};
    judgeMap[s.judge_id][s.candidate_id][s.criterion_id] = s.score;
  });

  // 3. Process each judge
  for (const [judgeId, candidateScores] of Object.entries(judgeMap)) {
    const results = [];

    for (const [candidateId, criterionScores] of Object.entries(
      candidateScores,
    )) {
      let categoryRaw = 0;
      const maxScore = Number(category.maxScore) || 0;
      const categoryWeight = (Number(category.percentage) || 0) / 100;

      if (maxScore <= 0) continue; // prevent division by zero

      // compute category raw score (0–1)
      for (const criterion of criteria) {
        const score = Number(criterionScores[criterion.id]) || 0;
        const criterionWeight = (Number(criterion.percentage) || 0) / 100;
        categoryRaw += (score / maxScore) * criterionWeight;
      }

      // average = weighted contribution to overall event, no rounding
      const average = categoryRaw * categoryWeight * 100;

      results.push({
        candidate_id: Number(candidateId),
        judge_id: Number(judgeId),
        average, // raw decimal
      });
    }

    // Sort by average for ranking
    results.sort((a, b) => b.average - a.average);

    // Save or upsert CategoryResult (no total_score)
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      await CategoryResult.upsert({
        category_id: categoryId,
        candidate_id: r.candidate_id,
        judge_id: r.judge_id,
        average: r.average, // raw decimal stored
        rank: i + 1,
      });
    }
  }

  return true;
}

module.exports = { generateCategoryResults };
