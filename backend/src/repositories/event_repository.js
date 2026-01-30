const { Event, Category, Stage, Judge, Candidate } = require('../database/models');

function create(data, transaction) {
    return Event.create(data, { transaction });
}

function findById(id) {
    return Event.findByPk(id);
}

function findByIdWithRelations(id) {
    return Event.findByPk(id, {
        include: [
            { model: Category, as: 'categories' },
            { model: Stage, as: 'stages' },
            { model: Judge, as: 'judges' },
            { model: Candidate, as: 'candidates' },
        ],
    });
}

function findByUser(userId) {
    return Event.findAll({
        where: { user_id: userId },
    });
}

async function softDelete(eventId, userId) {
    return sequelize.transaction(async (t) => {
        const event = await Event.findByPk(eventId, { transaction: t });

        if (!event) throw new Error('Event not found');
        if (event.user_id !== userId) throw new Error('Unauthorized');

        await event.destroy({ transaction: t });

        return true;
    });
}

module.exports = {
    create,
    findById,
    findByIdWithRelations,
    findByUser,
    softDelete,
};
