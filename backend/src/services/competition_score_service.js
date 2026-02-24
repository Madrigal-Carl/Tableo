const competitionScoreRepository = require("../repositories/competition_score_repository");
const {
  Candidate,
  Criterion,
  CompetitionScore,
  Category,
  Judge, // ✅ ADD THIS
} = require("../database/models");
const { generateCategoryResults } = require("./category_result_service");
const { Op, fn, col } = require("sequelize"); // ✅ ADD fn, col

async function submitScores(scores) {
  // 1. Save competition scores
  await competitionScoreRepository.bulkUpsert(scores);

  // 2. Find all unique categories affected by the submitted scores
  const criterionIds = [...new Set(scores.map((s) => s.criterion_id))];

  const categories = await Criterion.findAll({
    where: { id: criterionIds },
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
  const category = await Category.findByPk(categoryId);
  if (!category) throw new Error("Category not found");

  const candidates = await Candidate.findAll({
    where: { event_id: category.event_id },
    attributes: ["id"],
  });

  const criteria = await Criterion.findAll({
    where: { category_id: categoryId },
    attributes: ["id"],
  });

  const totalRequired = candidates.length * criteria.length;
  if (totalRequired === 0) return true;

  const scoredCount = await CompetitionScore.count({
    where: {
      judge_id: judgeId,
      criterion_id: { [Op.in]: criteria.map((c) => c.id) },
      candidate_id: { [Op.in]: candidates.map((c) => c.id) },
    },
  });

  return scoredCount === totalRequired;
}

/* =====================================================
   ✅ ADD THIS FUNCTION FOR WAITING SCREEN
===================================================== */

async function getCategoryJudgeStatuses(categoryId) {
  const category = await Category.findByPk(categoryId);
  if (!category) throw new Error("Category not found");

  const eventId = category.event_id;

  // 1️⃣ Get all judges in the event
  const judges = await Judge.findAll({
    where: { event_id: eventId },
    attributes: ["id", "name", "sequence"],
    order: [["sequence", "ASC"]],
  });

  if (!judges.length) return [];

  // 2️⃣ Get candidates & criteria
  const candidates = await Candidate.findAll({
    where: { event_id: eventId },
    attributes: ["id"],
  });

  const criteria = await Criterion.findAll({
    where: { category_id: categoryId },
    attributes: ["id"],
  });

  const candidateIds = candidates.map((c) => c.id);
  const criterionIds = criteria.map((c) => c.id);

  const totalRequired = candidateIds.length * criterionIds.length;

  if (totalRequired === 0) {
    return judges.map((j) => ({
      id: j.id,
      name: j.name,
      status: "done",
      scored: 0,
      required: 0,
    }));
  }

  // 3️⃣ Count scores per judge (ONE optimized query)
  const groupedScores = await CompetitionScore.findAll({
    attributes: [
      "judge_id",
      [fn("COUNT", col("id")), "score_count"],
    ],
    where: {
      criterion_id: { [Op.in]: criterionIds },
      candidate_id: { [Op.in]: candidateIds },
    },
    group: ["judge_id"],
    raw: true,
  });

  const scoreMap = {};
  groupedScores.forEach((row) => {
    scoreMap[row.judge_id] = parseInt(row.score_count);
  });

  // 4️⃣ Build final result
  return judges.map((judge) => {
    const scoredCount = scoreMap[judge.id] || 0;

    let status = "pending";

    if (scoredCount === 0) {
      status = "pending";
    } else if (scoredCount < totalRequired) {
      status = "scoring";
    } else {
      status = "done";
    }

    return {
      id: judge.id,
      name: judge.name,
      status,
      scored: scoredCount,
      required: totalRequired,
    };
  });
}

/* ===================================================== */

module.exports = {
  submitScores,
  hasCompletedCategory,
  getCategoryJudgeStatuses,
};