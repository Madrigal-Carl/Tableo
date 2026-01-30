const sequelize = require("../database/models").sequelize;
const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");
const categoryStageRepo = require("../repositories/category_stage_repository");

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

// Get categories for an event (linked stages only)
async function getCategoriesByEvent(eventId) {
  return categoryRepo.findByEvent(eventId);
}

module.exports = { createCategory, getCategoriesByEvent };
