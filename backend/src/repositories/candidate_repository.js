const { Candidate } = require('../database/models');

function create(data, transaction) {
    return Candidate.create(data, { transaction });
}

async function findEventByCandidateId(candidateId, transaction) {
    const candidate = await Candidate.findByPk(candidateId, { transaction });
    if (!candidate) throw new Error('Candidate not found');
    return candidate.event_id;
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

module.exports = { create, findByEventIncludingSoftDeleted, update, findEventByCandidateId };
