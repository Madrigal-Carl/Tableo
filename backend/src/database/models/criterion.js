'use strict';

module.exports = (sequelize, DataTypes) => {
    const Criterion = sequelize.define('Criterion', {
        label: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    }, {
        paranoid: true,
        timestamps: true,
        underscored: true,
    });

    Criterion.associate = function (models) {
        Criterion.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
        Criterion.hasMany(models.CompetitionScore, { foreignKey: 'criterion_id', as: 'criterion' });
    };

    return Criterion;
}