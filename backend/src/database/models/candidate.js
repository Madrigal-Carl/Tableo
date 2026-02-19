"use strict";

module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define(
    "Candidate",
    {
      path: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: false },
      sex: { type: DataTypes.ENUM("male", "female"), allowNull: true },
      sequence: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
    },
  );

  Candidate.associate = function (models) {
    Candidate.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
  };

  return Candidate;
};
