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

/**
 * SINGLE CATEGORY CREATE
 */
async function createCategory({ eventId, name, percentage, maxScore, stage_id, userId }) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) {
      throw new Error("You are not allowed to add categories to this event");
    }

    // 🔒 Check total percentage for the stage
    const existingTotal =
      (await categoryRepo.sumPercentageByStage(stage_id, eventId, t)) || 0;
    if (existingTotal + Number(percentage) > 100) {
      throw new Error("Total category percentage cannot exceed 100%");
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

/**
 * BULK CATEGORY CREATE
 */
async function createCategories({ eventId, stage_id, categories, userId }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error("Categories must be a non-empty array");
  }

  const incomingTotal = categories.reduce(
    (sum, c) => sum + Number(c.percentage || 0),
    0
  );
  if (incomingTotal > 100) {
    throw new Error("Total percentage of all categories cannot exceed 100%");
  }

  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) {
      throw new Error("You are not allowed to add categories to this event");
    }

    const existingTotal =
      (await categoryRepo.sumPercentageByStage(stage_id, eventId, t)) || 0;
    if (existingTotal + incomingTotal > 100) {
      throw new Error("Total category percentage cannot exceed 100%");
    }

    const createdCategories = [];

    for (const category of categories) {
      if (!category.name || category.percentage == null || category.maxScore == null) {
        throw new Error("Invalid category payload");
      }

      const created = await categoryRepo.create(
        {
          name: category.name.trim(),
          percentage: Number(category.percentage),
          maxScore: Number(category.maxScore),
          event_id: eventId,
        },
        t
      );

      await categoryStageRepo.create(
        { categoryId: created.id, stageId: stage_id },
        t
      );

      createdCategories.push({
        ...created.toJSON(),
        stages: [{ id: stage_id }],
      });
    }

    return createdCategories;
  });
}

/**
 * GET CATEGORIES BY EVENT
 */
async function getCategoriesByEvent(eventId) {
  return categoryRepo.findByEvent(eventId);
}

/**
 * UPDATE CATEGORY
 */
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
  createCategories,
  getCategoriesByEvent,
  updateCategory,
  getEventIdByCategoryId,
};
