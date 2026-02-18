const competitionScoreRepository = require("../repositories/competition_score_repository");

async function submitScores(scores) {
  // Could add additional business logic here, like checking duplicates
  return await competitionScoreRepository.bulkUpsert(scores);
}

module.exports = { submitScores };
