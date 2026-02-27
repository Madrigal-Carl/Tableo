const sequelize = require("../database/models").sequelize;
const stageRepo = require("../repositories/stage_repository");
const stageCandidateRepo = require("../repositories/stage_candidate_repository");
const judgeRepo = require("../repositories/judge_repository");
const candidateRepo = require("../repositories/candidate_repository");
const { isStageFullyCompleted } = require("./competition_score_service");

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

async function computeStageRanking(stageId, candidates) {
  const stage = await stageRepo.findStageWithCategories(stageId);
  if (!stage) throw new Error("Stage not found");

  const categories = stage.categories;
  const categoryIds = categories.map((c) => c.id);

  if (!categoryIds.length) {
    throw new Error("No categories found for this stage");
  }

  // Get judges (for judge_name)
  const judges = await judgeRepo.findByEventIncludingSoftDeleted(
    stage.event_id,
  );
  const judgeMap = new Map(judges.map((j) => [j.id, j.name]));

  const categoryResults =
    await stageRepo.findCategoryResultsByCategoryIds(categoryIds);

  const candidateCategoryMap = {};

  for (const result of categoryResults) {
    const { candidate_id, category_id, judge_id, average } = result;

    candidateCategoryMap[candidate_id] ??= {};
    candidateCategoryMap[candidate_id][category_id] ??= {
      sum: 0,
      judgeCount: 0,
      judges: [],
    };

    candidateCategoryMap[candidate_id][category_id].sum += average;
    candidateCategoryMap[candidate_id][category_id].judgeCount += 1;

    candidateCategoryMap[candidate_id][category_id].judges.push({
      judge_id,
      score: average,
    });
  }

  const categoryRankings = {};

  for (const category of categories) {
    const categoryId = category.id;

    const categoryCandidates = candidates.map((candidate) => {
      const data = candidateCategoryMap[candidate.id]?.[categoryId] ?? {
        sum: 0,
        judgeCount: 0,
        judges: [],
      };

      const finalAverage = data.judgeCount > 0 ? data.sum / data.judgeCount : 0;

      return {
        candidate_id: candidate.id,
        sequence: candidate.sequence,
        name: candidate.name,
        sex: candidate.sex,
        path: candidate.path,
        total_average: finalAverage,
        judge_scores: data.judges,
      };
    });

    // Ranking function (based on averaged total_average)
    const rankByTotal = (list) => {
      list.sort((a, b) => b.total_average - a.total_average);

      let rank = 1;
      for (let i = 0; i < list.length; i++) {
        if (list[i].total_average === 0) {
          list[i].rank = "";
          continue;
        }
        if (i > 0 && list[i].total_average < list[i - 1].total_average) {
          rank = i + 1;
        }
        list[i].rank = rank;
      }

      return list;
    };

    const males = rankByTotal(
      categoryCandidates.filter((c) => c.sex?.toLowerCase() === "male"),
    );

    const females = rankByTotal(
      categoryCandidates.filter((c) => c.sex?.toLowerCase() === "female"),
    );

    categoryRankings[category.name] = {
      males,
      females,
    };
  }

  return categoryRankings;
}

async function computeStageOverallRanking(stageId, candidates) {
  const stage = await stageRepo.findStageWithCategories(stageId);
  if (!stage) throw new Error("Stage not found");

  const categories = stage.categories;
  const categoryIds = categories.map((c) => c.id);

  if (!categoryIds.length) {
    throw new Error("No categories found for this stage");
  }

  const categoryResults =
    await stageRepo.findCategoryResultsByCategoryIds(categoryIds);

  /*
    Structure:
    candidateMap[candidateId][categoryId] = {
        sum,
        judgeCount
    }
  */
  const candidateMap = {};

  for (const result of categoryResults) {
    const { candidate_id, category_id, average } = result;

    candidateMap[candidate_id] ??= {};
    candidateMap[candidate_id][category_id] ??= {
      sum: 0,
      judgeCount: 0,
    };

    candidateMap[candidate_id][category_id].sum += average;
    candidateMap[candidate_id][category_id].judgeCount += 1;
  }

  // Build overall totals
  const overallCandidates = candidates.map((candidate) => {
    const categoryData = candidateMap[candidate.id] ?? {};

    let stageTotal = 0;

    for (const category of categories) {
      const data = categoryData[category.id];

      if (data && data.judgeCount > 0) {
        const categoryAverage = data.sum / data.judgeCount;
        stageTotal += categoryAverage; // 🔥 sum category averages
      }
    }

    return {
      candidate_id: candidate.id,
      name: candidate.name,
      sex: candidate.sex,
      path: candidate.path,
      stage_total: stageTotal,
    };
  });

  const rankByTotal = (list) => {
    list.sort((a, b) => b.stage_total - a.stage_total);

    let rank = 1;
    for (let i = 0; i < list.length; i++) {
      if (list[i].stage_total === 0) {
        list[i].rank = "";
        continue;
      }
      if (i > 0 && list[i].stage_total < list[i - 1].stage_total) {
        rank = i + 1;
      }
      list[i].rank = rank;
    }

    return list;
  };

  const males = rankByTotal(
    overallCandidates.filter((c) => c.sex?.toLowerCase() === "male"),
  );

  const females = rankByTotal(
    overallCandidates.filter((c) => c.sex?.toLowerCase() === "female"),
  );

  return {
    males,
    females,
  };
}

async function getActiveStage(eventId) {
  const stages = await stageRepo.findByEventIncludingSoftDeleted(eventId);

  if (!stages.length) return null;

  // Sort by sequence
  const sortedStages = stages
    .filter((s) => !s.deletedAt)
    .sort((a, b) => a.sequence - b.sequence);

  // Find latest stage that has advancement limits
  const advancedStage = sortedStages
    .filter(
      (s) =>
        s.maxMale !== null &&
        s.maxFemale !== null &&
        s.maxMale !== undefined &&
        s.maxFemale !== undefined,
    )
    .sort((a, b) => b.sequence - a.sequence)[0];

  if (advancedStage) return advancedStage;

  // Fallback → Stage 1 (lowest sequence)
  return sortedStages[0] || null;
}

async function getCandidatesForStage(stageId) {
  const stage = await stageRepo.findById(stageId);
  if (!stage) throw new Error("Stage not found");

  const eventId = stage.event_id;

  // ✅ If stage has advancement limits → use junction table
  if (stage.maxMale !== null && stage.maxFemale !== null) {
    const stageCandidates = await stageCandidateRepo.findByStage(stageId);

    if (!stageCandidates.length) return [];

    const candidateIds = stageCandidates.map((sc) => sc.candidate_id);

    return await candidateRepo.findByIds(candidateIds);
  }

  // ✅ First stage → use all event candidates
  return await candidateRepo.findByEventIncludingSoftDeleted(eventId);
}

async function getStageResults(stageId) {
  const stage = await stageRepo.findById(stageId);
  if (!stage) throw new Error("Stage not found");

  let candidates = [];

  const isAdvancedStage = stage.maxMale !== null && stage.maxFemale !== null;

  if (isAdvancedStage) {
    const stageCandidates = await stageCandidateRepo.findByStage(stageId);

    if (!stageCandidates.length) {
      throw new Error("No candidates found for this stage");
    }

    const candidateIds = stageCandidates.map((sc) => sc.candidate_id);

    candidates = await candidateRepo.findByIds(candidateIds);
  } else {
    candidates = await candidateRepo.findByEventIncludingSoftDeleted(
      stage.event_id,
    );
  }

  if (!candidates.length) {
    throw new Error("No candidates found for this stage");
  }

  return await computeStageRanking(stageId, candidates);
}

async function advanceCandidates(stageId, maleCount, femaleCount) {
  return sequelize.transaction(async (t) => {
    const stage = await stageRepo.findById(stageId, t);
    if (!stage) throw new Error("Stage not found");

    const eventId = stage.event_id;

    const stageWithCategories = await stageRepo.findStageWithCategories(
      stageId,
      t,
    );

    if (!stageWithCategories.categories.length) {
      throw new Error("This stage has no categories.");
    }

    const stageCompleted = await isStageFullyCompleted(stageId);

    if (!stageCompleted) {
      throw new Error(
        "Cannot advance. Not all judges have completed scoring all categories for this stage.",
      );
    }

    const candidates = await getCandidatesForStage(stageId);

    if (!candidates.length) {
      throw new Error("No candidates found for this stage");
    }

    const results = await computeStageOverallRanking(stageId, candidates);

    const males = results.males;
    const females = results.females;

    if (maleCount > males.length) {
      throw new Error(
        `Not enough male candidates to advance. Only ${males.length} available.`,
      );
    }

    if (femaleCount > females.length) {
      throw new Error(
        `Not enough female candidates to advance. Only ${females.length} available.`,
      );
    }

    const topMales = males.slice(0, maleCount);
    const topFemales = females.slice(0, femaleCount);

    const nextStage = await stageRepo.findByEventAndSequence(
      eventId,
      stage.sequence + 1,
      t,
    );

    if (!nextStage) {
      throw new Error("No next stage found.");
    }

    const existingNextStageCandidates = await stageCandidateRepo.findByStage(
      nextStage.id,
    );

    if (existingNextStageCandidates.length) {
      throw new Error(
        "Candidates have already been advanced to the next stage.",
      );
    }

    const stageCandidates = [...topMales, ...topFemales].map((c) => ({
      stage_id: nextStage.id,
      candidate_id: c.candidate_id ?? c.candidateId,
    }));

    await stageRepo.update(
      nextStage.id,
      {
        maxMale: maleCount,
        maxFemale: femaleCount,
      },
      t,
    );

    await stageCandidateRepo.bulkCreate(stageCandidates, t);

    return stageCandidates;
  });
}

async function getStageOverallResults(stageId) {
  const stage = await stageRepo.findById(stageId);
  if (!stage) throw new Error("Stage not found");

  const candidates = await getCandidatesForStage(stageId);

  if (!candidates.length) {
    throw new Error("No candidates found for this stage");
  }

  return await computeStageOverallRanking(stageId, candidates);
}

module.exports = {
  updateStage,
  createOrUpdate,
  getStageResults,
  advanceCandidates,
  getCandidatesForStage,
  getActiveStage,
  getStageOverallResults,
};
