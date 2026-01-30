const { Candidate } = require('../database/models');

function create(data, transaction) {
    return Candidate.create(data, { transaction });
}

function findByEvent(eventId, transaction) {
    return Candidate.findAll({
        where: { event_id: eventId },
        order: [['id', 'ASC']],
        transaction,
    });
}

function findByEventIncludingSoftDeleted(eventId, transaction) {
    return Candidate.findAll({
        where: { event_id: eventId },
        paranoid: false,
        transaction,
        order: [["id", "ASC"]],
    });
}

module.exports = { create, findByEvent, findByEventIncludingSoftDeleted };
