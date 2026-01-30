"use strict";

module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define(
        "Candidate",
        {
            name: { type: DataTypes.STRING, allowNull: false },
            sex: { type: DataTypes.ENUM('male', 'female'), allowNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            deletedAt: 'deleted_at',
        },
    );

    Candidate.associate = function (models) {
        Candidate.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
    }

    return Candidate;
};
