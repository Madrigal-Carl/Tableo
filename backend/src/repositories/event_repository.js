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

module.exports = {
    create,
    findById,
    findByIdWithRelations,
    findByUser,
};
