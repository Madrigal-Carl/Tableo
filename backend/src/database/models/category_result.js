'use strict';

module.exports = (sequelize, DataTypes) => {
    const CategoryResult = sequelize.define('CategoryResult', {
        totalScore: { type: DataTypes.FLOAT, allowNull: false },
        average: { type: DataTypes.FLOAT, allowNull: false },
        rank: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        timestamps: true,
        underscored: true,
    });

    CategoryResult.associate = function (models) {
        CategoryResult.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
        CategoryResult.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
    }

    return CategoryResult;
};