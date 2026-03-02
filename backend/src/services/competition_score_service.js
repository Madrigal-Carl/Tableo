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

  // 🔥 Get stage of this category
  const stage =
    await require("../repositories/stage_repository").findStageByCategory(
      categoryId,
    );

  if (!stage) throw new Error("Stage not found for this category");

  // 🔥 Get candidates of this stage ONLY
  let candidates = [];

  const isAdvancedStage = stage.maxMale !== null && stage.maxFemale !== null;

  if (isAdvancedStage) {
    const stageCandidates =
      await require("../repositories/stage_candidate_repository").findByStage(
        stage.id,
      );

    const candidateIds = stageCandidates.map((sc) => sc.candidate_id);

    candidates = candidateIds.length
      ? await Candidate.findAll({
          where: { id: { [Op.in]: candidateIds } },
          attributes: ["id"],
        })
      : [];
  } else {
    // First stage → all event candidates
    candidates = await Candidate.findAll({
      where: { event_id: stage.event_id },
      attributes: ["id"],
    });
  }

  const criteria = await Criterion.findAll({
    where: { category_id: categoryId },
    attributes: ["id"],
  });

  const candidateIds = candidates.map((c) => c.id);
  const criterionIds = criteria.map((c) => c.id);

  const totalRequired = candidateIds.length * criterionIds.length;

  if (totalRequired === 0) return true;

  const scoredCount = await CompetitionScore.count({
    where: {
      judge_id: judgeId,
      criterion_id: { [Op.in]: criterionIds },
      candidate_id: { [Op.in]: candidateIds },
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

  // 2️⃣ Get stage of this category
  const stage =
    await require("../repositories/stage_repository").findStageByCategory(
      categoryId,
    );

  if (!stage) throw new Error("Stage not found for this category");

  // 3️⃣ Get ONLY candidates for this stage
  let candidates = [];

  const isAdvancedStage = stage.maxMale !== null && stage.maxFemale !== null;

  if (isAdvancedStage) {
    const stageCandidates =
      await require("../repositories/stage_candidate_repository").findByStage(
        stage.id,
      );

    const candidateIds = stageCandidates.map((sc) => sc.candidate_id);

    candidates = candidateIds.length
      ? await Candidate.findAll({
          where: { id: { [Op.in]: candidateIds } },
          attributes: ["id"],
        })
      : [];
  } else {
    // First stage → all event candidates
    candidates = await Candidate.findAll({
      where: { event_id: stage.event_id },
      attributes: ["id"],
    });
  }

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
    attributes: ["judge_id", [fn("COUNT", col("id")), "score_count"]],
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

async function isCategoryFullyCompleted(categoryId) {
  const category = await Category.findByPk(categoryId);
  if (!category) throw new Error("Category not found");

  const eventId = category.event_id;

  // 1️⃣ Get all judges in event
  const judges = await Judge.findAll({
    where: { event_id: eventId },
    attributes: ["id"],
  });

  if (!judges.length) return true;

  // 2️⃣ Check each judge
  for (const judge of judges) {
    const completed = await hasCompletedCategory(judge.id, categoryId);

    if (!completed) {
      return false; // ❌ If one judge incomplete → category not done
    }
  }

  return true; // ✅ All judges completed
}
/* ===================================================== */

async function isStageFullyCompleted(stageId) {
  // 1️⃣ Get stage with its categories
  const stage =
    await require("../repositories/stage_repository").findStageWithCategories(
      stageId,
    );

  if (!stage) throw new Error("Stage not found");

  const categories = stage.categories;
  if (!categories.length) return false;

  const eventId = stage.event_id;

  // 2️⃣ Get all judges of the event
  const judges = await Judge.findAll({
    where: { event_id: eventId },
    attributes: ["id"],
  });

  if (!judges.length) return true; // no judges = nothing to validate

  const judgeIds = judges.map((j) => j.id);

  // 3️⃣ Get all candidates of the event
  const candidates = await Candidate.findAll({
    where: { event_id: eventId },
    attributes: ["id"],
  });

  if (!candidates.length) return false;

  const candidateIds = candidates.map((c) => c.id);

  // 4️⃣ Get all criteria from ALL categories in this stage
  const categoryIds = categories.map((c) => c.id);

  const criteria = await Criterion.findAll({
    where: { category_id: { [Op.in]: categoryIds } },
    attributes: ["id"],
  });

  if (!criteria.length) return false;

  const criterionIds = criteria.map((c) => c.id);

  // 5️⃣ Total required scores per judge
  const totalRequiredPerJudge = candidateIds.length * criterionIds.length;

  // 6️⃣ Count actual scores grouped by judge
  const groupedScores = await CompetitionScore.findAll({
    attributes: ["judge_id", [fn("COUNT", col("id")), "score_count"]],
    where: {
      judge_id: { [Op.in]: judgeIds },
      candidate_id: { [Op.in]: candidateIds },
      criterion_id: { [Op.in]: criterionIds },
    },
    group: ["judge_id"],
    raw: true,
  });

  const scoreMap = {};
  groupedScores.forEach((row) => {
    scoreMap[row.judge_id] = parseInt(row.score_count);
  });

  // 7️⃣ Validate each judge
  for (const judgeId of judgeIds) {
    const scored = scoreMap[judgeId] || 0;

    if (scored !== totalRequiredPerJudge) {
      return false; // ❌ One judge incomplete
    }
  }

  return true; // ✅ All judges completed all categories
}

module.exports = {
  submitScores,
  hasCompletedCategory,
  getCategoryJudgeStatuses,
  isCategoryFullyCompleted,
  isStageFullyCompleted,
};
