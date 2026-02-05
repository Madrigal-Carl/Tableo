const { Stage } = require('../database/models');

function create(data, transaction) {
    return Stage.create(data, { transaction });
}

function findByEvent(eventId, transaction) {
    return Stage.findAll({
        where: { event_id: eventId },
        order: [['sequence', 'ASC']],
        transaction,
    });
}

function findByEventIncludingSoftDeleted(eventId, transaction) {
    return Stage.findAll({
        where: { event_id: eventId },
        paranoid: false,
        order: [['sequence', 'ASC']],
        transaction,
    });
}

async function findEventByStageId(stageId, transaction) {
    const stage = await Stage.findByPk(stageId, { transaction });

    if (!stage) {
        throw new Error('Stage not found');
    }

    return stage.event_id;
}

function update(id, data, transaction) {
    return Stage.update(data, {
        where: { id },
        transaction,
    });
}

module.exports = {
    create,
    findByEvent,
    findByEventIncludingSoftDeleted,
    findEventByStageId,
    update,
};
