const categoryService = require("../services/category_service");

// Create Category for an event
async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;

    const { event_id, name, percentage, maxScore, max_score } = req.body;

    const category = await categoryService.createCategory({
      event_id,
      name,
      percentage,
      maxScore: maxScore ?? max_score,
      userId,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: {
        id: category.id,
        event_id: category.event_id,
        name: category.name,
        percentage: category.percentage,
        maxScore: category.maxScore,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

// get all categories for an event
async function getCategoriesByEvent(req, res, next) {
  try {
    const { eventId } = req.params;

    const categories = await categoryService.getCategoriesByEvent(eventId);

    const formatted = categories.map((cat) => ({
      id: cat.id,
      event_id: cat.event_id,
      name: cat.name,
      percentage: cat.percentage,
      maxScore: cat.maxScore,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at,
    }));

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: formatted,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {createCategory,getCategoriesByEvent};
