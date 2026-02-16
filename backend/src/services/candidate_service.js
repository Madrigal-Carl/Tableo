const sequelize = require('../database/models').sequelize;
const candidateRepo = require('../repositories/candidate_repository');

async function updateCandidate(candidateId, data) {
    return sequelize.transaction(async (t) => {
        // Use repository to find the candidate's event
        const eventId = await candidateRepo.findEventByCandidateId(candidateId, t);

        await candidateRepo.findByEventIncludingSoftDeleted(eventId, t);
        await candidateRepo.update(candidateId, data, t);

        return await candidateRepo.findByEventIncludingSoftDeleted(eventId, t);
    });
}

async function createOrUpdate(eventId, newCount, transaction = null) {
    const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    for (let seq = 1; seq <= newCount; seq++) {
        let candidate = allCandidates.find(c => c.sequence === seq);

        if (candidate) {
            if (candidate.deletedAt) {
                await candidate.restore({ transaction });
            }
        } else {
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

    for (const candidate of allCandidates) {
        if (candidate.sequence > newCount && !candidate.deletedAt) {
            await candidate.destroy({ transaction });
        }
    }
}

// ✅ NEW: Fetch all candidates for a given event
async function findAllByEvent(eventId, transaction = null) {
    return candidateRepo.findByEventIncludingSoftDeleted(eventId, transaction);
}

module.exports = { 
    createOrUpdate, 
    updateCandidate, 
    findAllByEvent // ✅ export the new function
};
