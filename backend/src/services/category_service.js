const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");
const categoryStageRepo = require("../repositories/category_stage_repository");
const { sequelize } = require("../database/models");

async function createOrUpdateCategories({ eventId, stage_id, categories, userId }) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId)
      throw new Error("You are not allowed to modify this event");

    const allCategories = await categoryRepo.findByEventIncludingSoftDeleted(
      eventId,
      t
    );

    const usedCategoryIds = new Set();

    for (let index = 0; index < categories.length; index++) {
      const incoming = categories[index];
      const sequence = index + 1; // ✅ assign sequence here

      // 1️⃣ Try to find active category mapped to this stage
      let category = allCategories.find(
        (c) =>
          !c.deletedAt &&
          c.stages.some((s) => s.id === stage_id) &&
          !usedCategoryIds.has(c.id)
      );

      // 2️⃣ Try to restore soft-deleted category
      if (!category) {
        category = allCategories.find(
          (c) => c.deletedAt && !usedCategoryIds.has(c.id)
        );

        if (category) {
          await category.restore({ transaction: t });

          let categoryStage =
            await categoryStageRepo.findOneIncludingSoftDeleted(
              category.id,
              stage_id
            );

          if (categoryStage) {
            if (categoryStage.deletedAt) {
              await categoryStage.restore({ transaction: t });
            }
          } else {
            await categoryStageRepo.create(
              { categoryId: category.id, stageId: stage_id },
              t
            );
          }
        }
      }

      // 3️⃣ Create new if still none
      if (!category) {
        category = await categoryRepo.create(
          {
            sequence, // ✅ FIX ADDED
            name: incoming.name.trim(),
            percentage: incoming.percentage,
            maxScore: incoming.maxScore,
            event_id: eventId,
          },
          t
        );

        await categoryStageRepo.create(
          { categoryId: category.id, stageId: stage_id },
          t
        );
      } else {
        // ✅ update sequence also
        await category.update(
          {
            sequence, // ✅ FIX ADDED
            name: incoming.name.trim(),
            percentage: incoming.percentage,
            maxScore: incoming.maxScore,
          },
          { transaction: t }
        );
      }

      usedCategoryIds.add(category.id);
    }

    // Soft-delete categories removed from this stage
    for (const category of allCategories.filter((c) => !c.deletedAt)) {
      const isLinkedToStage = category.stages.some(
        (s) => s.id === stage_id
      );

      if (isLinkedToStage && !usedCategoryIds.has(category.id)) {
        await category.destroy({ transaction: t });
      }
    }

    return categoryRepo.findByEvent(eventId);
  });
}

async function getCategoriesByEvent(eventId) {
  return categoryRepo.findByEvent(eventId);
}

async function getCategoriesByStage(eventId, stageId) {
  return categoryRepo.findByEventAndStage(eventId, stageId);
}

module.exports = {
  createOrUpdateCategories,
  getCategoriesByEvent,
  getCategoriesByStage,
};