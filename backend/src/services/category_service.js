const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");
const categoryStageRepo = require("../repositories/category_stage_repository");
const { sequelize } = require("../database/models");

/**
 * Helper: Get event_id of a category
 */
async function getEventIdByCategoryId(categoryId) {
  const category = await categoryRepo.findById(categoryId);
  if (!category) throw new Error("Category not found");
  return category.event_id;
}

async function createCategory({ eventId, name, percentage, maxScore, stage_id, userId }) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");

    if (event.user_id !== userId) {
      throw new Error("You are not allowed to add categories to this event");
    }

    const category = await categoryRepo.create(
      { name, percentage, maxScore, event_id: eventId },
      t
    );

    await categoryStageRepo.create(
      { categoryId: category.id, stageId: stage_id },
      t
    );

    return {
      ...category.toJSON(),
      stages: [{ id: stage_id }],
    };
  });
}

async function getCategoriesByEvent(eventId) {
  return categoryRepo.findByEvent(eventId);
}

async function updateCategory({ categoryId, name, percentage, maxScore, stage_id }) {
  return sequelize.transaction(async (t) => {
    const category = await categoryRepo.findById(categoryId);
    if (!category) throw new Error("Category not found");

    await category.update(
      { name, percentage, maxScore },
      { transaction: t }
    );

    const existingStage = await categoryStageRepo.findOneIncludingSoftDeleted(
      categoryId,
      stage_id
    );

    if (existingStage) {
      if (existingStage.deletedAt) {
        await existingStage.restore({ transaction: t });
      }
    } else {
      await categoryStageRepo.create(
        { categoryId, stageId: stage_id },
        t
      );
    }

    await categoryStageRepo.softDeleteOtherStages(
      categoryId,
      stage_id,
      t
    );

    return categoryRepo.findById(categoryId);
  });
}

module.exports = {
  createCategory,
  getCategoriesByEvent,
  updateCategory,
  getEventIdByCategoryId,
};
