'use strict';

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        sequence: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        maxScore: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    }, {
        paranoid: true,
        timestamps: true,
        underscored: true,
    });

    Category.associate = function (models) {
        Category.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
        Category.hasMany(models.Criterion, { foreignKey: 'category_id', as: 'criteria' });
        Category.hasMany(models.CompetitionScore, { foreignKey: 'category_id', as: 'competition_score' });
        Category.hasOne(models.CategoryResult, { foreignKey: 'category_id', as: 'category_result' });
        Category.belongsToMany(models.Stage, {
            through: models.CategoryStage,
            foreignKey: 'categoryId',
            otherKey: 'stageId',
            as: 'stages',
        });
    };

    Category.addHook('beforeDestroy', async (category, options) => {
        if (options.force) return;
        const { Criterion, CategoryStage, CompetitionScore, CategoryResult, } = sequelize.models;
        const transaction = options.transaction;

        await Promise.all([
            CategoryStage.destroy({
                where: { category_id: category.id },
                individualHooks: true,
                transaction,
            }),
            Criterion.destroy({ where: { category_id: category.id }, transaction, }),
            CompetitionScore.destroy({ where: { category_id: category.id }, transaction, }),
            CategoryResult.destroy({ where: { category_id: category.id }, transaction, }),
        ]);
    });

    return Category;
}