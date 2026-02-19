const { Judge } = require('../database/models');

function create(data, transaction) {
    return Judge.create(data, { transaction });
}

function findByInvitationCode(invitationCode, transaction = null) {
    return Judge.findOne({
        where: { invitationCode },
        transaction,
    });
}

function findByEvent(eventId, transaction) {
    return Judge.findAll({
        where: { event_id: eventId },
        order: [['sequence', 'ASC']],
        transaction,
    });
}
function findByIdIncludingSoftDeleted(id, transaction = null) {
    return Judge.findByPk(id, {
        paranoid: false,   // include soft-deleted judges
        transaction,
    });
}

function findByEventIncludingSoftDeleted(eventId, transaction) {
    return Judge.findAll({
        where: { event_id: eventId },
        paranoid: false,
        transaction,
        order: [['sequence', 'ASC']],
    });
}

async function findEventByJudgeId(judgeId, transaction) {
    const judge = await Judge.findByPk(judgeId, { transaction });

    if (!judge) {
        throw new Error('Judge not found');
    }

    return judge.event_id;
}

function update(id, data, transaction) {
    return Judge.update(data, {
        where: { id },
        transaction,
    });
}

module.exports = {
    create,
    findByInvitationCode,
    findByEvent,
    findByEventIncludingSoftDeleted,
    findEventByJudgeId,
    update,
    findByIdIncludingSoftDeleted
};
