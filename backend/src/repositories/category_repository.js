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

function findByEventIncludingSoftDeleted(eventId, transaction) {
  return Category.findAll({
    where: { event_id: eventId },
    paranoid: false,
    include: [
      {
        model: Stage,
        as: "stages",
        through: { attributes: [] },
        attributes: ["id"],
      },
    ],
    transaction,
  });
}

function restore(categoryId, transaction) {
  return Category.restore({
    where: { id: categoryId },
    transaction,
  });
}

function findById(categoryId) {
  return Category.findByPk(categoryId, {
    include: [
      {
        model: Stage,
        as: "stages",
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
  });
}

async function sumPercentageByStage(stageId, eventId, transaction) {
  const total = await Category.sum("percentage", {
    where: { event_id: eventId },
    include: [
      {
        model: Stage,
        as: "stages",
        where: { id: stageId },
        attributes: [],
        through: { attributes: [] },
      },
    ],
    transaction,
  });

  return total || 0;
}

function findByEventAndStage(eventId, stageId) {
  return Category.findAll({
    where: {
      event_id: eventId,
    },
    include: [
      {
        model: Stage,
        as: "stages",
        where: { id: stageId },
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ],
    order: [["id", "ASC"]],
  });
}

module.exports = {
  create,
  findByEvent,
  findById,
  sumPercentageByStage,
  findByEventIncludingSoftDeleted,
  restore,
  findByEventAndStage
};