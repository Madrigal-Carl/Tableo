const {
  CompetitionScore,
  CategoryResult,
  Candidate,
  Criterion,
  Category,
} = require("../database/models");
const { Op } = require("sequelize");

async function generateCategoryResults(categoryId) {
  const category = await Category.findByPk(categoryId);
  if (!category) throw new Error("Category not found");

  const candidates = await Candidate.findAll({
    where: { event_id: category.event_id },
    attributes: ["id", "name", "sex"],
    raw: true,
  });

  const criteria = await Criterion.findAll({
    where: { category_id: categoryId },
    attributes: ["id", "percentage"],
    raw: true,
  });

  const scores = await CompetitionScore.findAll({
    where: {
      criterion_id: { [Op.in]: criteria.map((c) => c.id) },
      candidate_id: { [Op.in]: candidates.map((c) => c.id) },
    },
    attributes: ["candidate_id", "judge_id", "criterion_id", "score"],
    raw: true,
  });

  // judge_id → candidate_id → criterion_id → score
  const judgeMap = {};
  scores.forEach((s) => {
    judgeMap[s.judge_id] ??= {};
    judgeMap[s.judge_id][s.candidate_id] ??= {};
    judgeMap[s.judge_id][s.candidate_id][s.criterion_id] = s.score;
  });

  const candidateMap = {};
  candidates.forEach((c) => {
    candidateMap[c.id] = c;
  });

  // PROCESS PER JUDGE
  for (const [judgeId, candidateScores] of Object.entries(judgeMap)) {
    const maleResults = [];
    const femaleResults = [];

    for (const [candidateId, criterionScores] of Object.entries(
      candidateScores,
    )) {
      const candidate = candidateMap[candidateId];
      if (!candidate) continue;

      let categoryRaw = 0;
      const maxScore = Number(category.maxScore) || 0;
      const categoryWeight = (Number(category.percentage) || 0) / 100;

      if (maxScore <= 0) continue;

      for (const criterion of criteria) {
        const score = Number(criterionScores[criterion.id]) || 0;
        const criterionWeight = (Number(criterion.percentage) || 0) / 100;
        categoryRaw += (score / maxScore) * criterionWeight;
      }

      const average = categoryRaw * categoryWeight * 100;

      const entry = {
        candidate_id: Number(candidateId),
        judge_id: Number(judgeId),
        average,
      };

      if (candidate.sex?.toLowerCase() === "male") {
        maleResults.push(entry);
      } else if (candidate.sex?.toLowerCase() === "female") {
        femaleResults.push(entry);
      }
    }

    // 🔥 SORT & RANK PER SEX
    const rankAndSave = async (results) => {
      results.sort((a, b) => b.average - a.average);

      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        await CategoryResult.upsert({
          category_id: categoryId,
          candidate_id: r.candidate_id,
          judge_id: r.judge_id,
          average: r.average,
          rank: i + 1,
        });
      }
    };

    await rankAndSave(maleResults);
    await rankAndSave(femaleResults);
  }

  return true;
}

module.exports = { generateCategoryResults };
