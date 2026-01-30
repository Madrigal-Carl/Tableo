const { CategoryStage, Stage, Category } = require("../database/models");

// Create a category_stage link
function create(data, transaction) {
  return CategoryStage.create(data, { transaction });
}

// Get all stages linked to a category
function findByCategory(categoryId) {
  return CategoryStage.findAll({
    where: { category_id: categoryId },
    include: [
      {
        model: Stage,
        as: "stage", // must match the alias in CategoryStage.associate
        attributes: ["id", "round"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
    order: [["id", "ASC"]],
  });
}

module.exports = { create, findByCategory }; // ✅ export both functions
