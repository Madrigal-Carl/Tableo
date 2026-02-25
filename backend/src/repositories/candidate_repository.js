const { Candidate } = require("../database/models");
const { Op } = require("sequelize");

function create(data, transaction) {
  return Candidate.create(data, { transaction });
}

async function findEventByCandidateId(candidateId, transaction) {
  const candidate = await Candidate.findByPk(candidateId, { transaction });
  if (!candidate) throw new Error("Candidate not found");
  return candidate.event_id;
}

function findByEventIncludingSoftDeleted(eventId, transaction) {
  return Candidate.findAll({
    where: { event_id: eventId },
    paranoid: false,
    transaction,
    order: [["sequence", "ASC"]],
  });
}

function update(id, data, transaction) {
  return Candidate.update(data, {
    where: { id },
    transaction,
  });
}

function countActiveByEvent(eventId, transaction) {
  return Candidate.count({
    where: {
      event_id: eventId,
    },
    transaction,
  });
}

function softDelete(candidateId, transaction) {
  return Candidate.destroy({
    where: { id: candidateId },
    transaction,
  });
}

function findByEventAndSex(eventId, sex, transaction) {
  return Candidate.findAll({
    where: { event_id: eventId, sex },
    order: [["sequence", "ASC"]],
    transaction,
  });
}

async function findByIds(ids) {
  return Candidate.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
}

module.exports = {
  create,
  findByEventIncludingSoftDeleted,
  update,
  findEventByCandidateId,
  countActiveByEvent,
  softDelete,
  findByEventAndSex,
  findByIds,
};
