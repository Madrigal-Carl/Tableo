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
        as: "stage",
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

// Find specific category-stage INCLUDING soft deleted
function findOneIncludingSoftDeleted(categoryId, stageId) {
  return CategoryStage.findOne({
    where: {
      category_id: categoryId,
      stage_id: stageId,
    },
    paranoid: false,
  });
}

// Soft delete all other stages except the active one
async function softDeleteOtherStages(categoryId, activeStageId, transaction) {
  return CategoryStage.destroy({
    where: {
      category_id: categoryId,
      stage_id: { [require("sequelize").Op.ne]: activeStageId },
    },
    transaction,
  });
}



module.exports = { create, findByCategory, findOneIncludingSoftDeleted, softDeleteOtherStages };
