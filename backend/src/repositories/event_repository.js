const {
  Event,
  Category,
  Stage,
  Judge,
  Candidate,
  sequelize,
  EventResult,
} = require("../database/models");
const { Op } = require("sequelize");

function create(data, transaction) {
  return Event.create(data, { transaction });
}

function findById(id, transaction) {
  return Event.findByPk(id, { transaction });
}

function findByIdWithRelations(id) {
  return Event.findByPk(id, {
    include: [
      {
        model: Category,
        as: "categories",
        include: [
          {
            model: sequelize.models.CategoryResult,
            as: "category_result",
            separate: true,
            order: [["id", "ASC"]],
          },
          {
            model: sequelize.models.Criterion,
            as: "criteria",
            separate: true,
            order: [["id", "ASC"]],
          },
        ],
      },
      { model: Stage, as: "stages" },
      { model: Judge, as: "judges" },
      { model: Candidate, as: "candidates" },
    ],
  });
}

async function softDelete(eventId, userId) {
  return sequelize.transaction(async (t) => {
    const event = await Event.findByPk(eventId, { transaction: t });

    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) throw new Error("Unauthorized");

    await event.destroy({ transaction: t });

    return true;
  });
}

function update(id, data, transaction) {
  return Event.update(data, {
    where: { id },
    transaction,
  });
}

async function findByUser(userId) {
  return Event.findAll({
    where: { user_id: userId },
    include: [
      { model: sequelize.models.Stage, as: "stages" },
      { model: sequelize.models.Judge, as: "judges" },
      { model: sequelize.models.Candidate, as: "candidates" },
    ],
    order: [["date", "ASC"]],
  });
}

async function findDeletedByUser(userId) {
  return Event.findAll({
    where: {
      user_id: userId,
      deletedAt: { [Op.not]: null },
    },
    paranoid: false,
    include: [
      { model: sequelize.models.Stage, as: "stages" },
      { model: sequelize.models.Judge, as: "judges" },
      { model: sequelize.models.Candidate, as: "candidates" },
    ],
    order: [["deletedAt", "DESC"]],
  });
}

async function findDeletedById(eventId, transaction) {
  return Event.findOne({
    where: { id: eventId },
    paranoid: false,
    transaction,
  });
}

async function restore(eventId, transaction) {
  return Event.restore({
    where: { id: eventId },
    transaction,
  });
}

async function getAllEvents() {
  return Event.findAll({
    include: [
      { model: Stage, as: "stages" },
      { model: Judge, as: "judges" },
      { model: Candidate, as: "candidates" },
      {
        model: Category,
        as: "categories",
        include: [
          { model: sequelize.models.CategoryResult, as: "category_result" },
          { model: sequelize.models.Criterion, as: "criteria" },
        ],
      },
      { model: sequelize.models.User, as: "creator", attributes: ["email"] },
    ],
    order: [["date", "ASC"]],
  });
}

async function findResultsByEvent(eventId) {
  return EventResult.findAll({
    where: { event_id: eventId },
    include: [{ model: Candidate, as: "candidate" }],
    order: [["rank", "ASC"]],
  });
}

module.exports = {
  create,
  findById,
  findByIdWithRelations,
  findByUser,
  softDelete,
  update,
  findDeletedByUser,
  findDeletedById,
  restore,
  getAllEvents,
  findResultsByEvent,
};
