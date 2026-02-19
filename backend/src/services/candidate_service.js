const sequelize = require("../database/models").sequelize;
const candidateRepo = require("../repositories/candidate_repository");

async function remapSequence(eventId, transaction, sex = null) {
  let candidates = await candidateRepo.findByEventIncludingSoftDeleted(
    eventId,
    transaction,
  );

  candidates = candidates.filter((c) => !c.deletedAt);

  if (sex) {
    candidates = candidates.filter((c) => c.sex === sex);
  }

  candidates.sort((a, b) => a.sequence - b.sequence);

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const correctSequence = i + 1;
    if (candidate.sequence !== correctSequence) {
      await candidateRepo.update(
        candidate.id,
        { sequence: correctSequence },
        transaction,
      );
    }
  }
}

async function updateCandidate(candidateId, data) {
  return sequelize.transaction(async (t) => {
    const eventId = await candidateRepo.findEventByCandidateId(candidateId, t);
    await candidateRepo.update(candidateId, data, t);

    if (data.sex) {
      await remapSequence(eventId, t, data.sex);
    }

    return await candidateRepo.findByEventIncludingSoftDeleted(eventId, t);
  });
}

async function createOrUpdate(eventId, newCount, transaction = null) {
  const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
    eventId,
    transaction,
  );

  const deletedCandidates = allCandidates
    .filter((c) => c.deletedAt)
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

  for (let i = 0; i < newCount; i++) {
    const activeCandidates = allCandidates.filter((c) => !c.deletedAt);
    const candidate = activeCandidates[i];

    if (candidate) continue;

    const candidateToRestore = deletedCandidates.shift();
    if (candidateToRestore) {
      await candidateToRestore.restore({ transaction });
    } else {
      await candidateRepo.create(
        {
          name: `Candidate`,
          event_id: eventId,
        },
        transaction,
      );
    }
  }

  const activeCandidates = allCandidates.filter((c) => !c.deletedAt);
  for (let i = newCount; i < activeCandidates.length; i++) {
    await candidateRepo.softDelete(activeCandidates[i].id, transaction);
  }
}

async function syncCandidates(eventId) {
  return sequelize.transaction(async (t) => {
    const allCandidates = await candidateRepo.findByEventIncludingSoftDeleted(
      eventId,
      t,
    );

    const deletedCandidates = allCandidates
      .filter((c) => c.deletedAt)
      .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

    if (deletedCandidates.length > 0) {
      await deletedCandidates[0].restore({ transaction: t });
    } else {
      await candidateRepo.create(
        {
          name: `Candidate`,
          event_id: eventId,
        },
        t,
      );
    }

    const sexes = ["male", "female"];
    for (const sex of sexes) {
      await remapSequence(eventId, t, sex);
    }

    return await candidateRepo.findByEventIncludingSoftDeleted(eventId, t);
  });
}

async function deleteCandidate(candidateId) {
  return sequelize.transaction(async (t) => {
    const eventId = await candidateRepo.findEventByCandidateId(candidateId, t);

    const candidate = (
      await candidateRepo.findByEventIncludingSoftDeleted(eventId, t)
    ).find((c) => c.id === candidateId);

    if (!candidate) throw new Error("Candidate not found");

    await candidateRepo.softDelete(candidateId, t);

    if (candidate.sex) {
      await remapSequence(eventId, t, candidate.sex);
    }

    return await candidateRepo.findByEventIncludingSoftDeleted(eventId, t);
  });
}

module.exports = {
  createOrUpdate,
  updateCandidate,
  syncCandidates,
  deleteCandidate,
  remapSequence,
};
