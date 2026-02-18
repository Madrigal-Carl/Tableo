"use strict";

module.exports = (sequelize, DataTypes) => {
  const CompetitionScore = sequelize.define(
    "CompetitionScore",
    {
      score: { type: DataTypes.FLOAT, allowNull: false, deafultValue: 0 },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
    },
  );

  CompetitionScore.associate = function (models) {
    CompetitionScore.belongsTo(models.CategoryStage, {
      foreignKey: "category_stage_id",
      as: "category_stage",
    });
    CompetitionScore.belongsTo(models.Judge, {
      foreignKey: "judge_id",
      as: "judge",
    });
    CompetitionScore.belongsTo(models.Criterion, {
      foreignKey: "criterion_id",
      as: "criterion",
    });
  };

  return CompetitionScore;
};
