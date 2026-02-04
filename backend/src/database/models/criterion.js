'use strict';

module.exports = (sequelize, DataTypes) => {
    const Criterion = sequelize.define(
        'Criterion',
        {
            label: { type: DataTypes.STRING(255), allowNull: false, unique: true },
            percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
            category_id: { type: DataTypes.INTEGER, allowNull: false }, // make sure foreign key exists
        },
        {
            tableName: 'criterion', // ✅ use exact table name
            paranoid: true,         // soft delete
            timestamps: true,
            underscored: true,
        }
    );

    Criterion.associate = function (models) {
        // Each criterion belongs to a category
        Criterion.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });

        // Each criterion can have many competition scores
        Criterion.hasMany(models.CompetitionScore, { foreignKey: 'criterion_id', as: 'scores' });
    };

    return Criterion;
};
