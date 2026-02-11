const categoryService = require("../services/category_service");

async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    /**
     * CASE 1: BULK CREATE (ARRAY)
     * Expected body:
     * {
     *   stage_id: number,
     *   categories: [
     *     { name, percentage, maxScore },
     *     ...
     *   ]
     * }
     */
    if (Array.isArray(req.body.categories)) {
      const { categories, stage_id } = req.body;

      if (!categories.length) {
        return res.status(400).json({
          message: "Categories array cannot be empty",
        });
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

    /**
     * CASE 2: SINGLE CREATE (DEFAULT / BACKWARD COMPATIBLE)
     * Expected body:
     * {
     *   name,
     *   percentage,
     *   maxScore,
     *   stage_id
     * }
     */
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

module.exports = {
  createCategory,
  getCategoriesByEvent,
  updateCategory,
};
