const { Category, Stage } = require("../database/models");

// Create a category
function create(data, transaction) {
  return Category.create(data, { transaction });
}

// Get categories for an event including only linked stages
function findByEvent(eventId) {
  return Category.findAll({
    where: { event_id: eventId },
    include: [
      {
        model: Stage,
        as: "stages",
        through: { attributes: [] }, // hide join table fields
        attributes: ["id", "round"], // only return stage ID and round
      },
    ],
    order: [["id", "ASC"]],
  });
}

// Find a category by ID
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
