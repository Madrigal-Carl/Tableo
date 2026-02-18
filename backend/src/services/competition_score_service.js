const competitionScoreRepository = require("../repositories/competition_score_repository");
const {
  Candidate,
  Criterion,
  CompetitionScore,
  Category,
} = require("../database/models");
const { Op } = require("sequelize");

async function submitScores(scores) {
  // Could add additional business logic here, like checking duplicates
  return await competitionScoreRepository.bulkUpsert(scores);
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
