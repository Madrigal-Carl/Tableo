const { Judge } = require('../database/models');

function create(data, transaction) {
    return Judge.create(data, { transaction });
}

function findByInvitationCode(invitationCode) {
    return Judge.findOne({
        where: { invitationCode },
    });
}

module.exports = {
    create,
    findByInvitationCode,
};
