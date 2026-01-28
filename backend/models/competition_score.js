'use strict';

module.exports = (sequelize, DataTypes) => {
    const CompetitionScore = sequelize.define('CompetitionScore', {
        score: { type: DataTypes.FLOAT, allowNull: false },
    }, {
        timestamps: true,
        underscored: true,
    });

    CompetitionScore.associate = function (models) {
        CompetitionScore.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
        CompetitionScore.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
        CompetitionScore.belongsTo(models.Judge, { foreignKey: 'judge_id', as: 'judge' });
    };

    return CompetitionScore;
};