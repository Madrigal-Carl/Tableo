const { Category } = require("../database/models");

function create(data, transaction) {
  return Category.create(data, { transaction });
}

module.exports = { create };
``
