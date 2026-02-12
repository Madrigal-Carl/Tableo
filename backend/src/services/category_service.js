const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");
const categoryStageRepo = require("../repositories/category_stage_repository");
const { sequelize } = require("../database/models");

async function createOrUpdateCategories({
  eventId,
  stage_id,
  categories,
  userId,
}) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) {
      throw new Error("You are not allowed to modify this event");
    }

    const allCategories =
      await categoryRepo.findByEventIncludingSoftDeleted(eventId, t);

    const stageCategories = allCategories.filter(c =>
      c.stages.some(s => s.id === stage_id)
    );

    const activeCategories = stageCategories.filter(c => !c.deletedAt);
    const softDeletedCategories = stageCategories.filter(c => c.deletedAt);

    const usedCategoryIds = new Set();

    /** CREATE / UPDATE / RESTORE **/
    for (const incoming of categories) {
      const nameKey = incoming.name.trim().toLowerCase();

      // 1️⃣ Match active category by name
      let category = activeCategories.find(
        c =>
          !usedCategoryIds.has(c.id) &&
          c.name.toLowerCase() === nameKey
      );

      // 2️⃣ Reuse soft-deleted category
      if (!category && softDeletedCategories.length > 0) {
        category = softDeletedCategories.shift();

        await category.restore({ transaction: t });
      }

      // 3️⃣ Create brand new
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

        await categoryStageRepo.create(
          { categoryId: category.id, stageId: stage_id },
          t
        );
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

    /** SOFT DELETE REMOVED ACTIVE CATEGORIES **/
    for (const category of activeCategories) {
      if (!usedCategoryIds.has(category.id)) {
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
