"use strict";

module.exports = (sequelize, DataTypes) => {
  const StageCandidate = sequelize.define(
    "StageCandidate",
    {
      stageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "stage_candidates",
      paranoid: true,
      timestamps: true,
      underscored: true,
    },
  );
  StageCandidate.associate = function (models) {
    StageCandidate.belongsTo(models.Candidate, {
      foreignKey: "candidateId",
      as: "candidate",
    });
    StageCandidate.belongsTo(models.Stage, {
      foreignKey: "stageId",
      as: "stage",
    });
  };

  return StageCandidate;
};
