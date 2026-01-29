const { Stage } = require('../database/models');

function create(data, transaction) {
    return Stage.create(data, { transaction });
}

module.exports = { create };
