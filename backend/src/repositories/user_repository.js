const { User } = require('../database/models');

module.exports = {
    findByEmail(email) {
        return User.findOne({ where: { email } });
    },

    create(data) {
        return User.create(data);
    },
};
