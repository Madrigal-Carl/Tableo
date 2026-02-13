const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");
const categoryStageRepo = require("../repositories/category_stage_repository");
const { sequelize } = require("../database/models");

async function createOrUpdateCategories({ eventId, stage_id, categories, userId }) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) throw new Error("You are not allowed to modify this event");

    // Fetch all categories including soft-deleted
    const allCategories = await categoryRepo.findByEventIncludingSoftDeleted(eventId, t);

    const usedCategoryIds = new Set();

    for (const incoming of categories) {
      // 1️⃣ Try to find an active category mapped to this stage
      let category = allCategories.find(c =>
        !c.deletedAt &&
        c.stages.some(s => s.id === stage_id) &&
        !usedCategoryIds.has(c.id)
      );

      // 2️⃣ If none, try to find a soft-deleted category for the event
      if (!category) {
        category = allCategories.find(c =>
          c.deletedAt && !usedCategoryIds.has(c.id)
        );

        if (category) {
          await category.restore({ transaction: t });

          // Check if a soft-deleted CategoryStage exists
          let categoryStage = await categoryStageRepo.findOneIncludingSoftDeleted(category.id, stage_id);

          if (categoryStage) {
            if (categoryStage.deletedAt) {
              await categoryStage.restore({ transaction: t });
            }
          } else {
            await categoryStageRepo.create({ categoryId: category.id, stageId: stage_id }, t);
          }
        }
      }

      // 3️⃣ If still none, create new
      if (!category) {
        category = await categoryRepo.create(
          {
            name: incoming.name.trim(),
            percentage: incoming.percentage,
            maxScore: incoming.maxScore,
            event_id: eventId,
          },
          t
        );

        await categoryStageRepo.create({ categoryId: category.id, stageId: stage_id }, t);
      } else {
        await category.update(
          {
            name: incoming.name.trim(),
            percentage: incoming.percentage,
            maxScore: incoming.maxScore,
          },
          { transaction: t }
        );
      }

      usedCategoryIds.add(category.id);
    }

    // Soft-delete categories that are linked to this stage but not in the incoming list
    for (const category of allCategories.filter(c => !c.deletedAt)) {
      const isLinkedToStage = category.stages.some(s => s.id === stage_id);
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

module.exports = {
  createOrUpdateCategories,
  getCategoriesByEvent,
  getCategoriesByStage,
};
