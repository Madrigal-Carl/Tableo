"use strict";

module.exports = (sequelize, DataTypes) => {
  const Criterion = sequelize.define(
    "Criterion",
    {
      label: { type: DataTypes.STRING(255), allowNull: false },
      percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "criterion",
      paranoid: true, // soft delete enabled
      deletedAt: "deleted_at", // <-- explicitly map deleted_at column
      timestamps: true,
      underscored: true,
    },
  );

  Criterion.associate = function (models) {
    Criterion.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
    Criterion.hasMany(models.CompetitionScore, {
      foreignKey: "criterion_id",
      as: "scores",
    });
  };

  return Criterion;
};
