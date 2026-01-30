const { CategoryStage } = require("../database/models");

function create(data, transaction) {
  return CategoryStage.create(data, { transaction });
}

module.exports = { create };
