'use strict';

module.exports = (sequelize, DataTypes) => {
    const EventResult = sequelize.define('EventResult', {
        totalScore: { type: DataTypes.FLOAT, allowNull: false },
        average: { type: DataTypes.FLOAT, allowNull: false },
        rank: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        paranoid: true,
        timestamps: true,
        underscored: true,
    });

    EventResult.associate = function (models) {
        EventResult.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
        EventResult.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
    };

    return EventResult;
}
