const sequelize = require('../database/models').sequelize;
const stageRepo = require('../repositories/stage_repository');

async function updateStage(stageId, data) {
    return sequelize.transaction(async (t) => {
        const eventId = await stageRepo.findEventByStageId(stageId, t);

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
