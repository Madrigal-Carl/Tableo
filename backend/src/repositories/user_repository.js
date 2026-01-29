const { User } = require('../database/models');

module.exports = {
    findByEmail(email) {
        return User.findOne({ where: { email } });
    },

    create(data) {
        return User.create(data);
    },

    updatePassword(id, hashedPassword) {
        return User.update({ password: hashedPassword }, { where: { id } });
    },
};
