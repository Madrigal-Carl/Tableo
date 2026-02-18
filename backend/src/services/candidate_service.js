const sequelize = require('../database/models').sequelize;
const candidateRepo = require('../repositories/candidate_repository');
const { Candidate } = require('../database/models'); // adjust path if needed

// Update a candidate and return all active candidates for the event
async function updateCandidate(candidateId, data) {
    return sequelize.transaction(async (t) => {
        // Update candidate row
        await candidateRepo.update(candidateId, data, t);

        // Fetch the updated candidate only
        const updatedCandidate = await candidateRepo.findById(candidateId, t);
        return updatedCandidate;
    });
}

// ORIGINAL: used for restoration flow (kept as-is)
async function createOrUpdate(eventId, newCount, transaction = null) {
    const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    const candidateToRestore = allCandidates.find(c => c.deletedAt !== null);

    if (candidateToRestore) {
        await candidateToRestore.restore({ transaction });
    } else {
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

    return await candidateRepo.findByEvent(eventId, transaction);
}

// NEW: used for Edit Event "number of candidates"
async function syncByCount(eventId, targetCount, transaction = null) {
    // Fetch all candidates including soft-deleted
    const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    const active = allCandidates.filter(c => c.deletedAt === null);
    const deleted = allCandidates.filter(c => c.deletedAt !== null);

    const currentCount = active.length;

    // Determine the last used sequence among ALL candidates
    let lastSequence = allCandidates.length
        ? Math.max(...allCandidates.map(c => c.sequence))
        : 0;

    // ADD candidates
    if (targetCount > currentCount) {
        let toAdd = targetCount - currentCount;

        // Restore soft-deleted candidates first
        for (let i = 0; i < toAdd && deleted.length > 0; i++) {
            const c = deleted.shift();
            lastSequence++;
            await c.restore({ transaction });
            await candidateRepo.update(c.id, { sequence: lastSequence }, transaction);
            toAdd--; // one restored
        }

        // Create remaining new candidates
        for (let i = 0; i < toAdd; i++) {
            lastSequence++;
            await candidateRepo.create(
                {
                    name: `Candidate ${lastSequence}`,
                    sequence: lastSequence,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    // REMOVE candidates if targetCount < currentCount
    if (targetCount < currentCount) {
        const toRemove = currentCount - targetCount;
        const toDelete = active.slice(-toRemove);

        for (const c of toDelete) {
            await c.destroy({ transaction });
        }
    }

    // Return updated list of active candidates
    return await candidateRepo.findByEvent(eventId, transaction);
}

// Fetch all active candidates for a given event
async function findAllByEvent(eventId, transaction = null) {
    return await candidateRepo.findByEvent(eventId, transaction);
}

// Soft delete a candidate
async function deleteCandidate(candidateId, transaction = null) {
    return sequelize.transaction(async (t) => {
        const tx = transaction || t;
        await candidateRepo.softDelete(candidateId, tx);
        return true;
    });
}

// Restore a candidate
async function restoreCandidate(candidateId, transaction = null) {
    return sequelize.transaction(async (t) => {
        const tx = transaction || t;
        await candidateRepo.restore(candidateId, tx);
        return true;
    });
}
async function createByCount(eventId, count, transaction) {
    const rows = [];

    for (let i = 1; i <= Number(count); i++) {
        rows.push({
            event_id: eventId,
            name: `Candidate ${i}`,
            sequence: i, // Assign sequence here!
        });
    }

    await Candidate.bulkCreate(rows, { transaction });
}


module.exports = { 
    createOrUpdate,     // restoration logic
    syncByCount,       // admin "set number"
    updateCandidate,
    findAllByEvent,
    deleteCandidate,   
    restoreCandidate,
    createByCount   
};
