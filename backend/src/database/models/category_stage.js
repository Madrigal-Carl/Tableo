'use strict';

module.exports = (sequelize, DataTypes) => {
    const CategoryStage = sequelize.define('CategoryStage', {}, {
        tableName: 'category_stage',
        timestamps: true,
        underscored: true,
        paranoid: true,
        deletedAt: 'deleted_at',
    });

    return CategoryStage;
};