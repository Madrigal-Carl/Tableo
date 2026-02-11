const categoryService = require("../services/category_service");

/**
 * CREATE CATEGORY
 * Supports single and bulk create
 */
async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    if (Array.isArray(req.body.categories)) {
      // BULK CREATE
      const { categories, stage_id } = req.body;

      if (!categories.length) {
        return res.status(400).json({ message: "Categories array cannot be empty" });
      }

      const createdCategories = await categoryService.createCategories({
        eventId,
        userId,
        stage_id,
        categories,
      });

      return res.status(201).json({
        message: "Categories created successfully",
        categories: createdCategories,
      });
    }

    // SINGLE CREATE
    const category = await categoryService.createCategory({
      eventId,
      userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET ALL CATEGORIES BY EVENT
 */
async function getCategoriesByEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const categories = await categoryService.getCategoriesByEvent(eventId);

    res.json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * SINGLE CATEGORY UPDATE
 */
async function updateCategory(req, res, next) {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.updateCategory({
      categoryId,
      ...req.body,
    });

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * BULK CATEGORY UPDATE
 * Expected body:
 * {
 *   eventId: number,
 *   categories: [
 *     { categoryId, name, percentage, maxScore, stage_id },
 *     ...
 *   ]
 * }
 */
async function bulkUpdateCategories(req, res, next) {
  try {
    const { eventId } = req.params;
    const { categories } = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Categories array cannot be empty" });
    }

    const updatedCategories = [];
    for (const cat of categories) {
      const updated = await categoryService.updateCategory({
        categoryId: cat.categoryId,
        name: cat.name,
        percentage: cat.percentage,
        maxScore: cat.maxScore,
        stage_id: cat.stage_id,
      });
      updatedCategories.push(updated);
    }

    res.status(200).json({
      message: "Categories updated successfully",
      categories: updatedCategories,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCategory,
  getCategoriesByEvent,
  updateCategory,
  bulkUpdateCategories,
};
