const sequelize = require("../database/models").sequelize;
const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");
const categoryStageRepo = require("../repositories/category_stage_repository");

// CREATE CATEGORY
async function createCategory({ event_id, name, percentage, maxScore, userId, stage_id }) {
  return sequelize.transaction(async (t) => {
    // Fetch event
    const event = await eventRepo.findByIdWithRelations(event_id);
    if (!event) throw new Error("Event not found");

    // Check ownership
    if (event.user_id !== userId)
      throw new Error("You are not allowed to add categories to this event");

    // Pick a stage
    let chosenStage;
    if (stage_id) {
      chosenStage = event.stages.find((s) => s.id === stage_id);
      if (!chosenStage) throw new Error("Stage not found in this event");
    } else {
      const assignedStageIds = event.categories
        .map((c) => c.stages?.map((s) => s.id) || [])
        .flat();
      chosenStage = event.stages.find((s) => !assignedStageIds.includes(s.id));
      if (!chosenStage)
        throw new Error("No available stage in this event to assign the category");
    }

    // Create category
    const category = await categoryRepo.create({ event_id, name, percentage, maxScore }, t);

    // Link category to stage
    await categoryStageRepo.create({ category_id: category.id, stage_id: chosenStage.id }, t);

    // Attach the linked stage to category for immediate response
    category.stages = [chosenStage];

    return category;
  });
}

// GET CATEGORIES FOR AN EVENT
async function getCategoriesByEvent(eventId) {
  return categoryRepo.findByEvent(eventId);
}

// UPDATE CATEGORY (details + category_stage)
async function updateCategory({ categoryId, name, percentage, maxScore, stage_id }) {
  return sequelize.transaction(async (t) => {
    // Fetch category
    const category = await categoryRepo.findById(categoryId);
    if (!category) throw new Error("Category not found");

    // Update category details
    category.name = name ?? category.name;
    category.percentage = percentage ?? category.percentage;
    category.maxScore = maxScore ?? category.maxScore;
    await category.save({ transaction: t });

    // Update category_stage if stage_id is provided
    if (stage_id) {
      const existingLinks = await categoryStageRepo.findByCategory(categoryId);

      // Check if stage is different from existing
      if (!existingLinks.some((link) => link.stage_id === stage_id)) {
        // Soft delete old links
        await Promise.all(existingLinks.map((link) => link.destroy({ transaction: t })));

        // Create new category_stage link
        await categoryStageRepo.create({ category_id: categoryId, stage_id }, t);
      }
    }

    // Attach updated stages for immediate response
    const updatedLinks = await categoryStageRepo.findByCategory(categoryId);
    category.stages = updatedLinks.map((link) => link.stage);

    return category;
  });
}

module.exports = { createCategory, getCategoriesByEvent, updateCategory };
