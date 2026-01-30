const categoryService = require("../services/category_service");

// Create Category
async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const { event_id, name, percentage, maxScore, max_score, stage_id } = req.body;

    const category = await categoryService.createCategory({
      event_id,
      name,
      percentage,
      maxScore: maxScore ?? max_score,
      stage_id,
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
        stages: (category.stages || []).map((s) => ({ id: s.id, round: s.round })),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get all categories for an event
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
      stages: (cat.stages || []).map((s) => ({ id: s.id, round: s.round })),
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: formatted,
    });
  } catch (err) {
    next(err);
  }
}

// UPDATE CATEGORY
async function updateCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { name, percentage, maxScore, stage_id } = req.body;

    const category = await categoryService.updateCategory({
      categoryId,
      name,
      percentage,
      maxScore,
      stage_id,
    });

    res.status(200).json({
      message: "Category updated successfully",
      category: {
        id: category.id,
        event_id: category.event_id,
        name: category.name,
        percentage: category.percentage,
        maxScore: category.maxScore,
        stages: (category.stages || []).map((s) => ({ id: s.id, round: s.round })),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, getCategoriesByEvent, updateCategory };
