'use strict';

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        title: { type: DataTypes.STRING, allowNull: false },
        date: { type: DataTypes.DATE, allowNull: false },
        timeStart: { type: DataTypes.TIME, allowNull: false },
        timeEnd: { type: DataTypes.TIME, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
    }, {
        timestamps: true,
        underscored: true,
    });

    Event.associate = function (models) {
        Event.belongsTo(models.User, { foreignKey: 'user_id', as: 'creator' });
        Event.hasMany(models.Judge, { foreignKey: 'event_id', as: 'judges' });
        Event.hasMany(models.Candidate, { foreignKey: 'event_id', as: 'candidates' });
        Event.hasMany(models.Category, { foreignKey: 'event_id', as: 'categories' });
    };

    return Event;
}