'use strict';

module.exports = (sequelize, DataTypes) => {
  const Criterion = sequelize.define(
    'Criterion',
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      label: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'criterion', // ✅ MUST match your migration table name
      timestamps: true,
      underscored: true,
      paranoid: true,
      deletedAt: 'deleted_at',
    }
  );

  Criterion.associate = function (models) {
    Criterion.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  };

  return Criterion;
};
