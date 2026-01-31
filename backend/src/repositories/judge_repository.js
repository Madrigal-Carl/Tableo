const { Judge } = require('../database/models');

function create(data, transaction) {
    return Judge.create(data, { transaction });
}

function findByInvitationCode(invitationCode) {
    return Judge.findOne({
        where: { invitationCode },
    });
}

function findByEvent(eventId, transaction) {
    return Judge.findAll({
        where: { event_id: eventId },
        order: [['id', 'ASC']],
        transaction,
    });
}

function findByEventIncludingSoftDeleted(eventId, transaction) {
    return Judge.findAll({
        where: { event_id: eventId },
        paranoid: false,
        transaction,
        order: [["id", "ASC"]],
    });
}

module.exports = {
    create,
    findByInvitationCode,
    findByEvent,
    findByEventIncludingSoftDeleted,
};
