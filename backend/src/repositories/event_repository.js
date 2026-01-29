const { Event } = require('../database/models');

function create(data, transaction) {
    return Event.create(data, { transaction });
}

module.exports = { create };
