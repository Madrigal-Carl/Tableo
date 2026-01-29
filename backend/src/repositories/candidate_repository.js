const { Candidate } = require('../database/models');

function create(data, transaction) {
    return Candidate.create(data, { transaction });
}

module.exports = { create };
