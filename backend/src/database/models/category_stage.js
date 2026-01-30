'use strict';

module.exports = (sequelize, DataTypes) => {
  const CategoryStage = sequelize.define(
    'CategoryStage',
    {
      category_id: { type: DataTypes.INTEGER, allowNull: false },
      stage_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'category_stage',
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  CategoryStage.associate = function (models) {
    CategoryStage.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    CategoryStage.belongsTo(models.Stage, {
      foreignKey: 'stage_id',
      as: 'stage',
    });
  };

  return CategoryStage;
};
