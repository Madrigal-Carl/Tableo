"use strict";

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      sequence: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      maxScore: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
    },
  );

  Category.associate = function (models) {
    Category.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
    Category.hasMany(models.Criterion, {
      foreignKey: "category_id",
      as: "criteria",
    });
    Category.hasOne(models.CategoryResult, {
      foreignKey: "category_id",
      as: "category_result",
    });
    Category.belongsToMany(models.Stage, {
      through: models.CategoryStage,
      foreignKey: "categoryId",
      otherKey: "stageId",
      as: "stages",
    });
  };

  Category.addHook("beforeDestroy", async (category, options) => {
    if (options.force) return; // only for hard delete

    const transaction = options.transaction;
    const { Criterion, CompetitionScore, CategoryStage, CategoryResult } =
      sequelize.models;

    await CategoryStage.destroy({
      where: { category_id: category.id },
      transaction,
    });

    const criteria = await Criterion.findAll({
      where: { category_id: category.id },
      transaction,
    });

    for (const crit of criteria) {
      await CompetitionScore.destroy({
        where: { criterion_id: crit.id },
        transaction,
      });
      await crit.destroy({ transaction });
    }

    await CategoryResult.destroy({
      where: { category_id: category.id },
      transaction,
    });
  });

  return Category;
};
