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
      timestamps: true,
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at',
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
