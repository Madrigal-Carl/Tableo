const sequelize = require("../database/models").sequelize;
const candidateRepo = require("../repositories/candidate_repository");

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
    transaction,
  );

  const map = new Map(allCandidates.map((c) => [c.sequence, c]));

  for (let seq = 1; seq <= newCount; seq++) {
    const candidate = map.get(seq);

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
        transaction,
      );
    }
  }

  for (const candidate of allCandidates) {
    if (candidate.sequence > newCount && !candidate.deletedAt) {
      await candidate.destroy({ transaction });
    }
  }
}

async function syncCandidates(eventId) {
  return sequelize.transaction(async (t) => {
    const currentActiveCount = await candidateRepo.countActiveByEvent(
      eventId,
      t,
    );

    const newCount = currentActiveCount + 1;
    await createOrUpdate(eventId, newCount, t);

    const updatedCandidates =
      await candidateRepo.findByEventIncludingSoftDeleted(eventId, t);

    return {
      before: currentActiveCount,
      after: newCount,
      candidates: updatedCandidates,
    };
  });
}

module.exports = { createOrUpdate, updateCandidate, syncCandidates };
