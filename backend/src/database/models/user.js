'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        password: { type: DataTypes.STRING, allowNull: false },
        rememberMe: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }, {
        timestamps: true,
        underscored: true
    });

    User.associate = function (models) {
        User.hasMany(models.Event, { foreignKey: 'user_id', as: 'events' });
    };

    return User;
}