const competitionScoreRepository = require("../repositories/competition_score_repository");
const {
  Candidate,
  Criterion,
  CompetitionScore,
  Category,
} = require("../database/models");
const { generateCategoryResults } = require("./category_result_service");
const { Op } = require("sequelize");

async function submitScores(scores) {
  // 1. Save competition scores
  await competitionScoreRepository.bulkUpsert(scores);

  // 2. Find all unique categories affected by the submitted scores
  const categoryIds = [...new Set(scores.map((s) => s.criterion_id))];

  const categories = await Criterion.findAll({
    where: { id: categoryIds },
    attributes: ["category_id"],
    raw: true,
  });

  const uniqueCategoryIds = [...new Set(categories.map((c) => c.category_id))];

  // 3. Generate category results for each affected category
  for (const categoryId of uniqueCategoryIds) {
    await generateCategoryResults(categoryId);
  }

  return { success: true };
}

async function hasCompletedCategory(judgeId, categoryId) {
  // Get the category
  const category = await Category.findByPk(categoryId);
  if (!category) throw new Error("Category not found");

  // Candidates belong to the category's event
  const candidates = await Candidate.findAll({
    where: { event_id: category.event_id },
    attributes: ["id"],
  });

  const criteria = await Criterion.findAll({
    where: { category_id: categoryId },
    attributes: ["id"],
  });

  const totalRequired = candidates.length * criteria.length;

  if (totalRequired === 0) return true; // edge case

  const scoredCount = await CompetitionScore.count({
    where: {
      judge_id: judgeId,
      criterion_id: { [Op.in]: criteria.map((c) => c.id) },
      candidate_id: { [Op.in]: candidates.map((c) => c.id) },
    },
  });

  return scoredCount === totalRequired;
}

module.exports = { submitScores, hasCompletedCategory };
