const sequelize = require('../database/models').sequelize;
const candidateRepo = require('../repositories/candidate_repository');
const { Candidate } = require('../database/models'); // adjust path if needed

// Update a candidate and return all active candidates for the event
async function updateCandidate(candidateId, data) {
    return sequelize.transaction(async (t) => {
        const eventId = await candidateRepo.findEventByCandidateId(candidateId, t);
        await candidateRepo.update(candidateId, data, t);
        return await candidateRepo.findByEvent(eventId, t);
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
    const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    const active = allCandidates.filter(c => c.deletedAt === null);
    const deleted = allCandidates.filter(c => c.deletedAt !== null);

    const currentCount = active.length;

    // ADD candidates
    if (targetCount > currentCount) {
        let toAdd = targetCount - currentCount;

        // Restore first
        for (let i = 0; i < toAdd && deleted.length > 0; i++) {
            const c = deleted.shift();
            await c.restore({ transaction });
        }

        // Create remaining
        const updatedAll = await candidateRepo.findByEventIncludingSoftDeleted(
            eventId,
            transaction
        );

        const lastSequence = Math.max(...updatedAll.map(c => c.sequence), 0);

        for (let i = currentCount + 1; i <= targetCount; i++) {
            await candidateRepo.create(
                {
                    name: `Candidate ${i}`,
                    sequence: i,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    // REMOVE candidates
    if (targetCount < currentCount) {
        const toRemove = currentCount - targetCount;
        const toDelete = active.slice(-toRemove);

        for (const c of toDelete) {
            await c.destroy({ transaction });
        }
    }

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
