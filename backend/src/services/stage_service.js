const sequelize = require("../database/models").sequelize;
const stageRepo = require("../repositories/stage_repository");

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
  // 1. Get stage with categories
  const stage = await stageRepo.findStageWithCategories(stageId);
  if (!stage) throw new Error("Stage not found");

  const categoryIds = stage.categories.map((c) => c.id);

  if (!categoryIds.length) {
    return [];
  }

  // 2. Get all category results of those categories
  const categoryResults =
    await stageResultRepo.findCategoryResultsByCategoryIds(categoryIds);

  /*
        Structure needed:
        {
            candidate_id,
            judge_id,
            average
        }
    */

  const candidateJudgeMap = {};

  for (const result of categoryResults) {
    const { candidate_id, judge_id, average } = result;

    if (!candidateJudgeMap[candidate_id]) {
      candidateJudgeMap[candidate_id] = {};
    }

    if (!candidateJudgeMap[candidate_id][judge_id]) {
      candidateJudgeMap[candidate_id][judge_id] = 0;
    }

    // SUM category averages
    candidateJudgeMap[candidate_id][judge_id] += average;
  }

  // 3. Compute final average per candidate
  const finalResults = [];

  for (const candidateId in candidateJudgeMap) {
    const judges = candidateJudgeMap[candidateId];
    const judgeTotals = Object.values(judges);

    const totalAverage =
      judgeTotals.reduce((sum, val) => sum + val, 0) / judgeTotals.length;

    finalResults.push({
      candidate_id: parseInt(candidateId),
      judge_totals: judges,
      final_average: totalAverage,
    });
  }

  // 4. Rank candidates
  finalResults.sort((a, b) => b.final_average - a.final_average);

  finalResults.forEach((item, index) => {
    item.rank = index + 1;
  });

  return finalResults;
}

module.exports = {
  updateStage,
  createOrUpdate,
  getStageResults,
};
