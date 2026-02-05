const competitionScoreRepo = require("../repositories/competition_score_repository");
const { getEventIdByCategoryId } = require("./category_service");
const sequelize = require("../database/models").sequelize;

/**
 * Add or update a single score (existing function, still used internally)
 */
async function setScore({ categoryId, candidateId, judgeId, criterionId, score }) {
  return sequelize.transaction(async (t) => {
    const eventId = await getEventIdByCategoryId(categoryId);
    if (!eventId) throw new Error("Invalid category");

    let competitionScore = await competitionScoreRepo.findByUnique({
      categoryId,
      candidateId,
      judgeId,
      criterionId,
      transaction: t,
    });

    if (competitionScore) {
      await competitionScore.update({ score }, { transaction: t });
    } else {
      competitionScore = await competitionScoreRepo.create(
        {
          category_id: categoryId,
          candidate_id: candidateId,
          judge_id: judgeId,
          criterion_id: criterionId,
          score,
        },
        t
      );
    }

    return competitionScore;
  });
}

/**
 * Add or update multiple scores in bulk
 * @param {number} categoryId
 * @param {number} judgeId
 * @param {Array} scores - array of { candidateId, criterionId, score }
 */
async function setBulkScores({ categoryId, judgeId, scores }) {
  return sequelize.transaction(async (t) => {
    const eventId = await getEventIdByCategoryId(categoryId);
    if (!eventId) throw new Error("Invalid category");

    const results = [];

    // Loop through scores and upsert each one
    for (const s of scores) {
      const res = await setScore({
        categoryId,
        candidateId: s.candidateId,
        judgeId,
        criterionId: s.criterionId,
        score: s.score,
      });
      results.push(res);
    }

    return results;
  });
}

/**
 * Get all scores for a category
 */
async function getScoresByCategory(categoryId) {
  return competitionScoreRepo.findByCategory(categoryId);
}

/**
 * Get all scores for a candidate (optionally filtered by categoryIds)
 */
async function getScoresByCandidate(candidateId, categoryIds = []) {
  return competitionScoreRepo.findByCandidate(candidateId, categoryIds);
}

module.exports = {
  setScore,         // single score (still useful)
  setBulkScores,    // new bulk scoring function
  getScoresByCategory,
  getScoresByCandidate,
};
