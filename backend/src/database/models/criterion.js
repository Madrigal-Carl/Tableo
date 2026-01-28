'use strict';

module.exports = (sequelize, DataTypes) => {
    const Criterion = sequelize.define('Criterion', {
        label: { type: DataTypes.TEXT, allowNull: false },
        percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    }, {
        timestamps: true,
        underscored: true,
    });

    Criterion.associate = function (models) {
        Criterion.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    };

    return Criterion;
}