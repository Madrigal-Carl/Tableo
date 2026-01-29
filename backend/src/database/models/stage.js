'use strict';

module.exports = (sequelize, DataTypes) => {
    const Stage = sequelize.define('Stage', {
        round: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    }, {
        timestamps: true,
        underscored: true,
    });

    Stage.associate = function (models) {
        Stage.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
        Stage.belongsToMany(models.Category, {
            through: 'category_stage',
            foreignKey: 'stage_id',
            otherKey: 'category_id',
            as: 'categories',
        });
    }

    return Stage;
}