const sequelize = require('../database/models').sequelize;
const candidateRepo = require('../repositories/candidate_repository');

// Update a candidate and return all active candidates for the event
async function updateCandidate(candidateId, data) {
    return sequelize.transaction(async (t) => {
        // Find the candidate's event
        const eventId = await candidateRepo.findEventByCandidateId(candidateId, t);

        // Update candidate data
        await candidateRepo.update(candidateId, data, t);

        // Return only active candidates
        return await candidateRepo.findByEvent(eventId, t);
    });
}

// Create or update candidates by count for an event
async function createOrUpdate(eventId, newCount, transaction = null) {
    // Get all candidates including soft-deleted
    const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    // Ensure candidates exist for each sequence
    for (let seq = 1; seq <= newCount; seq++) {
        let candidate = allCandidates.find(c => c.sequence === seq);

        if (candidate) {
            // Restore if soft-deleted
            if (candidate.deletedAt) {
                await candidate.restore({ transaction });
            }
        } else {
            // Create new candidate
            await candidateRepo.create(
                {
                    name: `Candidate ${seq}`,
                    sequence: seq,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    // Soft-delete candidates beyond newCount
    for (const candidate of allCandidates) {
        if (candidate.sequence > newCount && !candidate.deletedAt) {
            await candidate.destroy({ transaction });
        }
    }

    // Return only active candidates after sync
    return await candidateRepo.findByEvent(eventId, transaction);
}

// Fetch all active candidates for a given event (exclude soft-deleted)
async function findAllByEvent(eventId, transaction = null) {
    return candidateRepo.findByEvent(eventId, transaction);
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
    deleteCandidate,   // optional soft-delete API
    restoreCandidate   // optional restore API
};
