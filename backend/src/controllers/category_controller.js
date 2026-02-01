const categoryService = require("../services/category_service");

async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const category = await categoryService.createCategory({
      eventId,
      userId,
      ...req.body,
    });

    res.status(201).json({
      message: 'Category created successfully',
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
      message: 'Categories fetched successfully',
      categories,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await categoryService.updateCategory({ categoryId, ...req.body });

    res.status(200).json({
      message: "Category updated successfully",
      category: category,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, getCategoriesByEvent, updateCategory };
