const sequelize = require("../database/models").sequelize;
const stageRepo = require("../repositories/stage_repository");
const candidateRepo = require("../repositories/candidate_repository");
const judgeRepo = require("../repositories/judge_repository");

async function updateStage(stageId, data) {
  return sequelize.transaction(async (t) => {
    const stage = await stageRepo.findById(stageId, t);
    if (!stage) throw new Error("Stage not found");

    const eventId = stage.event_id;

    // If sequence is changing
    if (data.sequence !== undefined && data.sequence !== stage.sequence) {
      const existing = await stageRepo.findByEventAndSequence(
        eventId,
        data.sequence,
        t,
      );

      // ✅ If another stage already uses that sequence → swap
      if (existing && existing.id !== stageId) {
        // Swap the sequences
        await stageRepo.update(existing.id, { sequence: stage.sequence }, t);
      }
    }

    // Update current stage
    await stageRepo.update(stageId, data, t);

    return await stageRepo.findByEventIncludingSoftDeleted(eventId, t);
  });
}

async function createOrUpdate(eventId, newCount, transaction = null) {
  const allStages = await stageRepo.findByEventIncludingSoftDeleted(
    eventId,
    transaction,
  );

  // Ensure required stages exist
  for (let seq = 1; seq <= newCount; seq++) {
    const stage = allStages.find((s) => s.sequence === seq);

    if (stage) {
      if (stage.deletedAt) {
        await stage.restore({ transaction });
      }
    } else {
      await stageRepo.create(
        {
          name: `Stage ${seq}`,
          sequence: seq,
          event_id: eventId,
        },
        transaction,
      );
    }
  }

  // Soft-delete extra stages
  for (const stage of allStages) {
    if (stage.sequence > newCount && !stage.deletedAt) {
      await stage.destroy({ transaction });
    }
  }
}

async function getStageResults(stageId) {
  const stage = await stageRepo.findStageWithCategories(stageId);
  if (!stage) throw new Error("Stage not found");

  const categoryIds = stage.categories.map((c) => c.id);
  if (!categoryIds.length) {
    throw new Error("No categories found for this stage");
  }

  const candidates = await candidateRepo.findByEventIncludingSoftDeleted(
    stage.event_id,
  );

  if (!candidates.length) {
    throw new Error("No candidates found for this event");
  }

  const judges = await judgeRepo.findByEventIncludingSoftDeleted(
    stage.event_id,
  );

  if (!judges.length) {
    throw new Error("No judges found for this event");
  }

  const expectedScoreCount =
    candidates.length * judges.length * categoryIds.length;

  const categoryResults =
    await stageRepo.findCategoryResultsByCategoryIds(categoryIds);

  // ✅ STRICT COMPLETENESS CHECK
  const scoreSet = new Set();

  for (const result of categoryResults) {
    scoreSet.add(
      `${result.candidate_id}-${result.judge_id}-${result.category_id}`,
    );
  }

  if (scoreSet.size !== expectedScoreCount) {
    throw new Error(
      "Scoring is not complete. All judges must score all candidates in all categories.",
    );
  }

  const candidateJudgeMap = {};

  for (const result of categoryResults) {
    const { candidate_id, judge_id, average } = result;

    if (!candidateJudgeMap[candidate_id]) {
      candidateJudgeMap[candidate_id] = {};
    }

    if (!candidateJudgeMap[candidate_id][judge_id]) {
      candidateJudgeMap[candidate_id][judge_id] = 0;
    }

    candidateJudgeMap[candidate_id][judge_id] += average;
  }

  const computedResults = [];

  for (const candidate of candidates) {
    const judgesMap = candidateJudgeMap[candidate.id];
    if (!judgesMap) continue;

    const judgeTotals = Object.values(judgesMap);

    const finalAverage =
      judgeTotals.reduce((sum, val) => sum + val, 0) / judgeTotals.length;

    computedResults.push({
      candidate_id: candidate.id,
      name: candidate.name,
      sex: candidate.sex,
      final_average: finalAverage,
    });
  }

  const maleResults = computedResults
    .filter((c) => c.sex === "male")
    .sort((a, b) => b.final_average - a.final_average);

  const femaleResults = computedResults
    .filter((c) => c.sex === "female")
    .sort((a, b) => b.final_average - a.final_average);

  maleResults.forEach((item, index) => {
    item.rank = index + 1;
  });

  femaleResults.forEach((item, index) => {
    item.rank = index + 1;
  });

  return {
    males: maleResults,
    females: femaleResults,
  };
}

module.exports = {
  updateStage,
  createOrUpdate,
  getStageResults,
};
