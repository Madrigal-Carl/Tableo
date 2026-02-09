const { Category, Stage } = require("../database/models");

function create(data, transaction) {
  return Category.create(data, { transaction });
}

function findByEvent(eventId) {
  return Category.findAll({
    where: { event_id: eventId },
    include: [
      {
        model: Stage,
        as: "stages",
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "ASC"]],
  });
}

function findById(categoryId) {
  return Category.findByPk(categoryId, {
    include: [
      {
        model: Stage,
        as: "stages",
        through: { attributes: [] },
        attributes: ["id", "round"],
      },
    ],
  });
}

module.exports = { create, findByEvent, findById };
