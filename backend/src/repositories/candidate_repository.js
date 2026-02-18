const { Candidate } = require('../database/models');

// Create a candidate
function create(data, transaction) {
    return Candidate.create(data, { transaction });
}

// Find candidate's event by candidate ID
async function findEventByCandidateId(candidateId, transaction) {
    const candidate = await Candidate.findByPk(candidateId, { transaction });
    if (!candidate) throw new Error('Candidate not found');
    return candidate.event_id;
}

// Find all candidates including soft-deleted
function findByEventIncludingSoftDeleted(eventId, transaction) {
    return Candidate.findAll({
        where: { event_id: eventId },
        paranoid: false, // include soft-deleted
        transaction,
        order: [['sequence', 'ASC']],
    });
}

// Find all active candidates (exclude soft-deleted)
function findByEvent(eventId, transaction) {
    return Candidate.findAll({
        where: { event_id: eventId },
        transaction,
        order: [['sequence', 'ASC']],
    });
}

// Find candidate by ID (active only)
function findById(id, transaction) {
    return Candidate.findByPk(id, { transaction });
}

// Find candidate by ID including soft-deleted
function findByIdIncludingSoftDeleted(id, transaction) {
    return Candidate.findByPk(id, { paranoid: false, transaction });
}

// Update a candidate
function update(id, data, transaction) {
    return Candidate.update(data, { where: { id }, transaction });
}

// Soft delete a candidate
async function softDelete(id, transaction) {
    const candidate = await findById(id, transaction);
    if (!candidate) throw new Error('Candidate not found');
    return candidate.destroy({ transaction }); // soft delete
}

// Restore a soft-deleted candidate
async function restore(id, transaction) {
    const candidate = await findByIdIncludingSoftDeleted(id, transaction);
    if (!candidate) throw new Error('Candidate not found');
    return candidate.restore({ transaction });
}

module.exports = {
    create,
    findByEventIncludingSoftDeleted, 
    findByEvent,                    
    update,
    findEventByCandidateId,
    findById,                       
    findByIdIncludingSoftDeleted,    
    softDelete,                      
    restore                         
};
