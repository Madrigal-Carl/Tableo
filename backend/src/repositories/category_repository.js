const { Category, Stage, Criterion, sequelize } = require("../database/models");

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
  });
}

async function findByEventWithStagesAndCriteria(eventId, stageId = null, transaction = null) {
  const includeStages = {
    model: Stage,
    as: 'stages',
    attributes: ['id', 'name', 'sequence'],
    through: { attributes: [] },
    order: [['sequence', 'ASC']]
  };

  if (stageId) includeStages.where = { id: stageId };

  return Category.findAll({
    where: { event_id: eventId },
    include: [
      includeStages,
      {
        model: Criterion,
        as: 'criteria',
        attributes: ['id', 'label', 'percentage'],
        order: [['id', 'ASC']], // works without separate: true
      },
    ],
    order: [['id', 'ASC']],
    transaction,
  });
}

module.exports = {
  create,
  findByEvent,
  findById,
  sumPercentageByStage,
  findByEventIncludingSoftDeleted,
  restore,
  findByEventAndStage,
  findByEventWithStagesAndCriteria,
};