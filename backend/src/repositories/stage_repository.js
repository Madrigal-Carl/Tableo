const { Stage, Category, CategoryResult } = require("../database/models");
const { Op } = require("sequelize");
const sequelize = require("../database/models").sequelize;

function create(data, transaction) {
  return Stage.create(data, { transaction });
}
function findById(id, transaction) {
  return Stage.findByPk(id, { transaction });
}

function findByEventAndSequence(eventId, sequence, transaction) {
  return Stage.findOne({
    where: {
      event_id: eventId,
      sequence,
    },
    transaction,
  });
}
function findByEvent(eventId, transaction) {
  return Stage.findAll({
    where: { event_id: eventId },
    order: [["sequence", "ASC"]],
    transaction,
  });
}

function findByEventIncludingSoftDeleted(eventId, transaction) {
  return Stage.findAll({
    where: { event_id: eventId },
    paranoid: false,
    order: [["sequence", "ASC"]],
    transaction,
  });
}

async function findEventByStageId(stageId, transaction) {
  const stage = await Stage.findByPk(stageId, { transaction });

  if (!stage) {
    throw new Error("Stage not found");
  }

  return stage.event_id;
}

function update(id, data, transaction) {
  return Stage.update(data, {
    where: { id },
    transaction,
  });
}

function findCategoryResultsByCategoryIds(categoryIds) {
  return CategoryResult.findAll({
    where: {
      category_id: {
        [Op.in]: categoryIds,
      },
    },
    attributes: ["candidate_id", "judge_id", "category_id", "average"],
    raw: true,
  });
}

function findStageWithCategories(stageId) {
  return Stage.findByPk(stageId, {
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ],
  });
}

async function findPassedCandidates(stageId, transaction = null) {
  const stage = await sequelize.models.Stage.findByPk(stageId, {
    include: [
      {
        model: sequelize.models.Candidate,
        as: "candidates",
        required: false,
        paranoid: false,
      },
    ],
    transaction,
  });

  if (!stage) return [];

  return stage.candidates.map((c) => c.get({ plain: true }));
}

async function findStageByCategory(categoryId) {
  return await Stage.findOne({
    include: [
      {
        model: Category,
        as: "categories",
        where: { id: categoryId },
        through: { attributes: [] },
        attributes: [],
      },
    ],
  });
}

module.exports = {
  create,
  findByEvent,
  findByEventIncludingSoftDeleted,
  findEventByStageId,
  update,
  findById,
  findByEventAndSequence,
  findCategoryResultsByCategoryIds,
  findStageWithCategories,
  findPassedCandidates,
  findStageByCategory,
};
