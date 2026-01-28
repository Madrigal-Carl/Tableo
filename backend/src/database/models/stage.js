'use strict';

module.exports = (sequelize, DataTypes) => {
    const Stage = sequelize.define('Stage', {
        round: { type: DataTypes.Integer, allowNull: false, defaultValue: 1 },
    }, {
        timestamps: true,
        underscored: true,
    });

    Stage.associate = function (models) {
        Stage.hasOne(models.Category, { foreignKey: 'category_id', as: 'category' });
    }

    return Stage;
}