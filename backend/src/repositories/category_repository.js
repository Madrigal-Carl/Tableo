const { Category, Stage } = require("../database/models");

/**
 * Create a single category
 */
function create(data, transaction) {
  return Category.create(data, { transaction });
}

/**
 * Find all categories by event (with associated stages)
 */
function findByEvent(eventId) {
  return Category.findAll({
    where: { event_id: eventId },
    include: [
      {
        model: Stage,
        as: "stages",
        through: { attributes: [] }, // don't fetch pivot table fields
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "ASC"]],
  });
}

/**
 * Find a category by ID (with stages)
 */
function findById(categoryId) {
  return Category.findByPk(categoryId, {
    include: [
      {
        model: Stage,
        as: "stages",
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
  });
}

/**
 * Sum category percentages for a given stage in an event
 */
async function sumPercentageByStage(stageId, eventId, transaction) {
  const total = await Category.sum("percentage", {
    where: { event_id: eventId },
    include: [
      {
        model: Stage,
        as: "stages",        // must match Category.belongsToMany alias
        where: { id: stageId },
        attributes: [],      // we only need this for filtering
        through: { attributes: [] }, // ignore pivot table fields
      },
    ],
    transaction,
  });

  return total || 0;
}

module.exports = {
  create,
  findByEvent,
  findById,
  sumPercentageByStage,
};
