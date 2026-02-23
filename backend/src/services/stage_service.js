const sequelize = require('../database/models').sequelize;
const stageRepo = require('../repositories/stage_repository');

async function updateStage(stageId, data) {
    return sequelize.transaction(async (t) => {

        const stage = await stageRepo.findById(stageId, t);
        if (!stage) throw new Error("Stage not found");

        const eventId = stage.event_id;

        // If sequence is changing
        if (
            data.sequence !== undefined &&
            data.sequence !== stage.sequence
        ) {
            const existing = await stageRepo.findByEventAndSequence(
                eventId,
                data.sequence,
                t
            );

            // ✅ If another stage already uses that sequence → swap
            if (existing && existing.id !== stageId) {

                // Swap the sequences
                await stageRepo.update(
                    existing.id,
                    { sequence: stage.sequence },
                    t
                );
            }
        }

        // Update current stage
        await stageRepo.update(stageId, data, t);

        return await stageRepo.findByEventIncludingSoftDeleted(eventId, t);
    });
}

async function createOrUpdate(eventId, newCount, transaction = null) {
    const allStages = await stageRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    // Ensure required stages exist
    for (let seq = 1; seq <= newCount; seq++) {
        const stage = allStages.find(s => s.sequence === seq);

        if (stage) {
            if (stage.deletedAt) {
                await stage.restore({ transaction });
            }
        } else {
            await stageRepo.create(
                {
                    name: `Stage ${seq}`,
                    sequence: seq,
                    event_id: eventId,
                },
                transaction
            );
        }
    }

    // Soft-delete extra stages
    for (const stage of allStages) {
        if (stage.sequence > newCount && !stage.deletedAt) {
            await stage.destroy({ transaction });
        }
    }
}

module.exports = { updateStage, createOrUpdate };
