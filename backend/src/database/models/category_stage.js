'use strict';

module.exports = (sequelize, DataTypes) => {
  const CategoryStage = sequelize.define(
    'CategoryStage',
    {
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      stageId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'category_stages',
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  CategoryStage.associate = function (models) {
    CategoryStage.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    CategoryStage.belongsTo(models.Stage, {
      foreignKey: 'stageId',
      as: 'stage',
    });
  };

  return CategoryStage;
};
