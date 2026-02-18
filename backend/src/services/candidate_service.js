const sequelize = require('../database/models').sequelize;
const candidateRepo = require('../repositories/candidate_repository');

// Update a candidate and return all active candidates for the event
async function updateCandidate(candidateId, data) {
    return sequelize.transaction(async (t) => {
        // Find the candidate's event
        const eventId = await candidateRepo.findEventByCandidateId(candidateId, t);

        // Update candidate data
        await candidateRepo.update(candidateId, data, t);

        // Return only active candidates as an array
        const activeCandidates = await candidateRepo.findByEvent(eventId, t);
        return Array.isArray(activeCandidates) ? activeCandidates : [];
    });
}
// Create or update candidates by count for an event
async function createOrUpdate(eventId, newCount, transaction = null) {
    // Get all candidates including soft-deleted
    const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    // Try to restore **one soft-deleted candidate** first
    const candidateToRestore = allCandidates.find(c => c.deletedAt !== null);

    if (candidateToRestore) {
        // Restore only one
        await candidateToRestore.restore({ transaction });
    } else {
        // No deleted candidates to restore → create a new one
        const lastSequence = Math.max(...allCandidates.map(c => c.sequence), 0);
        await candidateRepo.create(
            {
                name: `Candidate ${lastSequence + 1}`,
                sequence: lastSequence + 1,
                event_id: eventId,
            },
            transaction
        );
    }

    // Return only active candidates after add/restore
    const activeCandidates = await candidateRepo.findByEvent(eventId, transaction);
    return Array.isArray(activeCandidates) ? activeCandidates : [];
}


// Fetch all active candidates for a given event (exclude soft-deleted)
async function findAllByEvent(eventId, transaction = null) {
    const activeCandidates = await candidateRepo.findByEvent(eventId, transaction);
    return Array.isArray(activeCandidates) ? activeCandidates : [];
}

// Optional: Soft delete a candidate by ID
async function deleteCandidate(candidateId, transaction = null) {
    return sequelize.transaction(async (t) => {
        const tx = transaction || t;
        await candidateRepo.softDelete(candidateId, tx);
        return true;
    });
}

// Optional: Restore a soft-deleted candidate by ID
async function restoreCandidate(candidateId, transaction = null) {
    return sequelize.transaction(async (t) => {
        const tx = transaction || t;
        await candidateRepo.restore(candidateId, tx);
        return true;
    });
}

module.exports = { 
    createOrUpdate, 
    updateCandidate, 
    findAllByEvent,
    deleteCandidate,   
    restoreCandidate   
};
