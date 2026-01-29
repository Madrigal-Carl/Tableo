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
        Category.hasMany(models.Criterion, { foreignKey: 'category_id', as: 'criteria' });
        Category.belongsToMany(models.Stage, {
            through: 'category_stage',
            foreignKey: 'category_id',
            otherKey: 'stage_id',
            as: 'stages',
        });
    };

    return Category;
}