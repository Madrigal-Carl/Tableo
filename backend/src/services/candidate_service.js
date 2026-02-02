const sequelize = require('../database/models').sequelize;
const candidateRepo = require('../repositories/candidate_repository');

async function updateCandidate(candidateId, data) {
    return sequelize.transaction(async (t) => {
        const candidate = await candidateRepo.findByEventIncludingSoftDeleted(data.event_id, t);
        const target = candidate.find(c => c.id === parseInt(candidateId));
        if (!target) throw new Error('Candidate not found');

        await candidateRepo.update(candidateId, data, t);
        return await candidateRepo.findByEventIncludingSoftDeleted(data.event_id, t);
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

module.exports = { createOrUpdate, updateCandidate };
