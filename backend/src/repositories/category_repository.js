const { Category } = require("../database/models");

function create(data, transaction) {
  return Category.create(data, { transaction });
}

// New function to get all categories for a given event
function findByEvent(eventId) {
  return Category.findAll({
    where: { event_id: eventId },
    order: [["id", "ASC"]], 
  });
}

module.exports = {create,findByEvent, };
