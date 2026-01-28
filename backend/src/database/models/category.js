'use strict';

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: { type: DataTypes.STRING, allowNull: false },
        percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        maxScore: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    }, {
        timestamps: true,
        underscored: true,
    });

    Category.associate = function (models) {
        Category.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
        Category.belongsTo(models.Stage, { foreignKey: 'stages_id', as: 'stages' });
        Category.hasMany(models.Criterion, { foreignKey: 'category_id', as: 'criteria' });
    };

    return Category;
}