'use strict';

module.exports = (sequelize, DataTypes) => {
    const CompetitionScore = sequelize.define('CompetitionScore', {
        score: { type: DataTypes.FLOAT, allowNull: false, deafultValue: 0 },
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        deletedAt: 'deleted_at',
    });

    CompetitionScore.associate = function (models) {
        CompetitionScore.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
        CompetitionScore.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
        CompetitionScore.belongsTo(models.Judge, { foreignKey: 'judge_id', as: 'judge' });
    };

    return CompetitionScore;
};