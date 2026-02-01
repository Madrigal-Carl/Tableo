const { Candidate } = require('../database/models');

function create(data, transaction) {
    return Candidate.create(data, { transaction });
}

function findByEventIncludingSoftDeleted(eventId, transaction) {
    return Candidate.findAll({
        where: { event_id: eventId },
        paranoid: false,
        transaction,
        order: [['sequence', 'ASC']],
    });
}

function update(id, data, transaction) {
    return Candidate.update(data, {
        where: { id },
        transaction,
    });
}

module.exports = { create, findByEventIncludingSoftDeleted, update };
