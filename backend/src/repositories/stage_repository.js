const { Stage } = require('../database/models');

function create(data, transaction) {
    return Stage.create(data, { transaction });
}

function findByEvent(eventId, transaction) {
    return Stage.findAll({
        where: { event_id: eventId },
        order: [['round', 'ASC']],
        transaction,
    });
}

module.exports = { create, findByEvent };
