const categoryService = require("../services/category_service");

async function createCategory(req, res, next) {
  try {
    const userId = req.user.id;

    const category = await categoryService.createCategory({
      ...req.body,
      userId,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory };
