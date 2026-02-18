'use srtict';

module.exports = (sequelize, DataTypes) => {
    const Judge = sequelize.define('Judge', {
        invitationCode: { type: DataTypes.STRING, allowNull: false, unique: true },
        name: { type: DataTypes.STRING, allowNull: false },
        suffix: { type: DataTypes.ENUM('mr', 'mrs', 'ms'), allowNull: true },
        sequence: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        paranoid: true,
        timestamps: true,
        underscored: true,
    });

    Judge.associate = function (models) {
        Judge.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
    }

    return Judge;
}