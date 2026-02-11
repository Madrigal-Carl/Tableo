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

    // Check total percentage for the stage
    const existingTotal = (await categoryRepo.sumPercentageByStage(stage_id, eventId, t)) || 0;
    if (existingTotal + Number(percentage) > 100) {
      throw new Error("Total category percentage cannot exceed 100%");
    }

    const category = await categoryRepo.create(
      { name: name.trim(), percentage: Number(percentage), maxScore: Number(maxScore), event_id: eventId },
      t
    );

    await categoryStageRepo.create(
      { categoryId: category.id, stageId: stage_id },
      t
    );

    return { ...category.toJSON(), stages: [{ id: stage_id }] };
  });
}

/**
 * BULK CATEGORY CREATE
 */
async function createCategories({ eventId, stage_id, categories, userId }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error("Categories must be a non-empty array");
  }

  const totalPercentage = categories.reduce((sum, c) => sum + Number(c.percentage || 0), 0);
  if (totalPercentage > 100) throw new Error("Total percentage of all categories cannot exceed 100%");

  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) throw new Error("You are not allowed to add categories to this event");

    const existingTotal = (await categoryRepo.sumPercentageByStage(stage_id, eventId, t)) || 0;
    if (existingTotal + totalPercentage > 100) {
      throw new Error("Total category percentage cannot exceed 100%");
    }

    const createdCategories = [];

    for (const cat of categories) {
      if (!cat.name || cat.percentage == null || cat.maxScore == null) {
        throw new Error("Invalid category payload");
      }

      const created = await categoryRepo.create(
        {
          name: cat.name.trim(),
          percentage: Number(cat.percentage),
          maxScore: Number(cat.maxScore),
          event_id: eventId,
        },
        t
      );

      await categoryStageRepo.create({ categoryId: created.id, stageId: stage_id }, t);

      createdCategories.push({ ...created.toJSON(), stages: [{ id: stage_id }] });
    }

    return createdCategories;
  });
}

/**
 * GET ALL CATEGORIES BY EVENT
 */
async function getCategoriesByEvent(eventId) {
  return categoryRepo.findByEvent(eventId);
}

/**
 * GET CATEGORIES BY STAGE
 */
async function getCategoriesByStage(eventId, stageId) {
  return categoryRepo.findByEventAndStage(eventId, stageId);
}

/**
 * SINGLE CATEGORY UPDATE
 */
async function updateCategory({ categoryId, name, percentage, maxScore, stage_id }) {
  return sequelize.transaction(async (t) => {
    const category = await categoryRepo.findById(categoryId);
    if (!category) throw new Error("Category not found");

    await category.update(
      { name: name.trim(), percentage: Number(percentage), maxScore: Number(maxScore) },
      { transaction: t }
    );

    const stageRelation = await categoryStageRepo.findOneIncludingSoftDeleted(categoryId, stage_id);
    if (stageRelation) {
      if (stageRelation.deletedAt) await stageRelation.restore({ transaction: t });
    } else {
      await categoryStageRepo.create({ categoryId, stageId: stage_id }, t);
    }

    await categoryStageRepo.softDeleteOtherStages(categoryId, stage_id, t);

    return categoryRepo.findById(categoryId);
  });
}

/**
 * BULK CATEGORY UPDATE
 * Add/update/remove categories with soft delete (like criteria update)
 */
async function updateCategories({ categories, userId, eventId }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error("Categories must be a non-empty array");
  }

  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) throw new Error("You are not allowed to update categories for this event");

    // Fetch all existing categories for this event including soft-deleted
    const existingCategories = await categoryRepo.findByEvent(eventId, { paranoid: false });
    const existingMap = new Map(existingCategories.map((c) => [c.id, c]));

    const updatedCategories = [];

    for (const cat of categories) {
      const { categoryId, name, percentage, maxScore, stage_id } = cat;

      if (!name || percentage == null || maxScore == null || !stage_id) {
        throw new Error("Invalid category payload");
      }

      if (categoryId) {
        // UPDATE existing category
        const existing = existingMap.get(categoryId);
        if (!existing) throw new Error(`Category ${categoryId} not found`);

        if (existing.deleted_at) await existing.restore({ transaction: t });

        // Check total percentage for stage
        const existingTotal = (await categoryRepo.sumPercentageByStage(stage_id, eventId, t)) || 0;
        const currentCatPercentage = existing.percentage;
        if (existingTotal - currentCatPercentage + Number(percentage) > 100) {
          throw new Error(`Total category percentage cannot exceed 100% for stage ${stage_id}`);
        }

        existing.name = name.trim();
        existing.percentage = Number(percentage);
        existing.maxScore = Number(maxScore);
        await existing.save({ transaction: t });

        // Stage relationship
        const stageRelation = await categoryStageRepo.findOneIncludingSoftDeleted(categoryId, stage_id);
        if (stageRelation) {
          if (stageRelation.deletedAt) await stageRelation.restore({ transaction: t });
        } else {
          await categoryStageRepo.create({ categoryId, stageId: stage_id }, t);
        }

        await categoryStageRepo.softDeleteOtherStages(categoryId, stage_id, t);

        updatedCategories.push(existing);
      } else {
        // CREATE new category
        const created = await categoryRepo.create(
          {
            name: name.trim(),
            percentage: Number(percentage),
            maxScore: Number(maxScore),
            event_id: eventId,
          },
          t
        );

        await categoryStageRepo.create({ categoryId: created.id, stageId: stage_id }, t);
        updatedCategories.push(created);
      }
    }

    // Soft-delete any existing categories not included in request
    for (const existing of existingCategories) {
      if (!categories.some((c) => c.categoryId === existing.id) && !existing.deleted_at) {
        await existing.destroy({ transaction: t });
      }
    }

    return updatedCategories;
  });
}

module.exports = {
  createCategory,
  createCategories,
  getCategoriesByEvent,
  getCategoriesByStage,
  updateCategory,
  updateCategories,
  getEventIdByCategoryId,
};
