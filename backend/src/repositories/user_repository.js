const { User } = require('../database/models');

function findByEmail(email) {
    return User.findOne({ where: { email } });
}

function findById(id) {
    return User.findByPk(id);
}

function create(data) {
    return User.create(data);
}

function updatePassword(id, hashedPassword) {
    return User.update({ password: hashedPassword }, { where: { id } });
}

module.exports = { findByEmail, findById, create, updatePassword };
