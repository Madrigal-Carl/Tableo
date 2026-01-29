"use strict";

module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define(
        "Candidate",
        {
            name: { type: DataTypes.STRING, allowNull: false },
            sex: { type: DataTypes.STRING, allowNull: true },
        },
        {
            timestamps: true,
            underscored: true,
        },
    );

    Candidate.associate = function (models) {
        Candidate.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
    }

    return Candidate;
};
