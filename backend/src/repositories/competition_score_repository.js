const { CompetitionScore } = require("../database/models");

async function bulkUpsert(scores) {
  return await CompetitionScore.bulkCreate(scores, {
    updateOnDuplicate: ["score", "updated_at"],
  });
}

module.exports = { bulkUpsert };
