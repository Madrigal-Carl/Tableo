const { StageCandidate } = require("../database/models");

async function bulkCreate(data, transaction) {
  return StageCandidate.bulkCreate(data, { transaction });
}

async function findByStage(stageId) {
  return StageCandidate.findAll({
    where: {
      stage_id: stageId,
    },
    attributes: ["candidate_id"],
    raw: true,
  });
}

module.exports = {
  bulkCreate,
  findByStage,
};
