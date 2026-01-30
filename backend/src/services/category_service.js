const sequelize = require("../database/models").sequelize;

const categoryRepo = require("../repositories/category_repository");
const eventRepo = require("../repositories/event_repository");

async function createCategory({
  event_id,
  name,
  percentage,
  maxScore,
  userId,
}) {
  return sequelize.transaction(async (t) => {
    // 1️⃣ Check if Event exists
    const event = await eventRepo.findById(event_id);

    if (!event) {
      throw new Error("Event not found");
    }

    // 2️⃣ Optional: Check if user owns the event
    if (event.user_id !== userId) {
      throw new Error("You are not allowed to add categories to this event");
    }

    // 3️⃣ Create Category
    const category = await categoryRepo.create(
      {
        event_id,
        name,
        percentage,
        maxScore,
      },
      t
    );

    return category;
  });
}

//get categories by event ID
async function getCategoriesByEvent(eventId) {
  // Optional: check if the event exists
  const event = await eventRepo.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const categories = await categoryRepo.findByEvent(eventId);
  return categories;
}

module.exports = {createCategory,getCategoriesByEvent};
