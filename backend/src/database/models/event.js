'use strict';

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        title: { type: DataTypes.STRING, allowNull: false },
        date: { type: DataTypes.DATE, allowNull: false },
        timeStart: { type: DataTypes.TIME, allowNull: false },
        timeEnd: { type: DataTypes.TIME, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        deletedAt: 'deleted_at',
    });

    Event.associate = function (models) {
        Event.belongsTo(models.User, { foreignKey: 'user_id', as: 'creator' });
        Event.hasMany(models.Judge, { foreignKey: 'event_id', as: 'judges' });
        Event.hasMany(models.Candidate, { foreignKey: 'event_id', as: 'candidates' });
        Event.hasMany(models.Category, { foreignKey: 'event_id', as: 'categories' });
        Event.hasMany(models.Stage, { foreignKey: 'event_id', as: 'stages' });
        Event.hasOne(models.EventResult, { foreignKey: 'event_id', as: 'eventResult' });
    };

    Event.addHook('beforeDestroy', async (event, options) => {
        if (options.force) return;
        const { Judge, Candidate, Category, Stage, EventResult } = sequelize.models;
        const transaction = options.transaction;

        await Promise.all([
            Category.destroy({
                where: { event_id: event.id },
                individualHooks: true,
                transaction,
            }),
            Judge.destroy({ where: { event_id: event.id }, transaction }),
            Candidate.destroy({ where: { event_id: event.id }, transaction }),
            Stage.destroy({ where: { event_id: event.id }, transaction }),
            EventResult.destroy({ where: { event_id: event.id }, transaction }),
        ]);
    });

    return Event;
}