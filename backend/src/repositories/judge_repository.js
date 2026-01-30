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

module.exports = {
    create,
    findByInvitationCode,
    findByEvent,
};
