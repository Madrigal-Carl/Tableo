const { StageCandidate } = require("../database/models");

function bulkCreate(data, transaction) {
  return StageCandidate.bulkCreate(data, { transaction });
}

module.exports = {
  bulkCreate,
};
