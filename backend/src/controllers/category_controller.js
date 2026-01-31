const categoryService = require("../services/category_service");

async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const category = await categoryService.createCategory({ ...req.body, userId });

    res.status(201).json({
      message: "Category created successfully",
      category: category,
    });
  } catch (err) {
    next(err);
  }
}

async function getCategoriesByEvent(req, res, next) {
  try {
    const categories = await categoryService.getCategoriesByEvent(req.params.eventId);

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: categories,
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
