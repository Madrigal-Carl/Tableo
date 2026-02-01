const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");
const categoryStageRepo = require("../repositories/category_stage_repository");
const sequelize = require("../database/models").sequelize;

<<<<<<< HEAD
async function createCategory({ name, percentage, maxScore, stage_id, event_id, userId }) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(event_id);
=======
async function createCategory({ eventId, name, percentage, maxScore, stage_id, userId }) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId);
>>>>>>> main
    if (!event) throw new Error("Event not found");

    if (event.user_id !== userId) throw new Error("You are not allowed to add categories to this event");

    // Create category
<<<<<<< HEAD
    const category = await categoryRepo.create({ name, percentage, maxScore, event_id }, t);
=======
    const category = await categoryRepo.create({ name, percentage, maxScore, eventId }, t);
>>>>>>> main

    // Link to stage
    await categoryStageRepo.create({ category_id: category.id, stage_id }, t);

    category.stages = [{ id: stage_id }];

    return category;
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

    let categoryStage = await categoryStageRepo.findOneIncludingSoftDeleted(
      categoryId,
      stage_id
    );

    if (categoryStage) {
      if (categoryStage.deletedAt) {
        await categoryStage.restore({ transaction: t });
      }
    } else {
      categoryStage = await categoryStageRepo.create(
        { category_id: categoryId, stage_id },
        t
      );
    }

    await categoryStageRepo.softDeleteOtherStages(
      categoryId,
      stage_id,
      t
    );

    const updatedCategory = await categoryRepo.findById(categoryId);
    return updatedCategory;
  });
}

module.exports = { createCategory, getCategoriesByEvent, updateCategory };
