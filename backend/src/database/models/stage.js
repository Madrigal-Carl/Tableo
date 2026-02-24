"use strict";

module.exports = (sequelize, DataTypes) => {
  const Stage = sequelize.define(
    "Stage",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxCandidates: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
    },
  );
  Stage.associate = function (models) {
    Stage.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
    Stage.belongsToMany(models.Category, {
      through: models.CategoryStage,
      foreignKey: "stage_id",
      otherKey: "category_id",
      as: "categories",
    });
    Stage.belongsToMany(models.Candidate, {
      through: models.StageCandidate,
      foreignKey: "stage_id",
      otherKey: "candidate_id",
      as: "candidates",
    });
  };

  return Stage;
};
