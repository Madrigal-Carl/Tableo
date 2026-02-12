const categoryService = require("../services/category_service");

async function createOrUpdateCategories(req, res, next) {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;
    const { stage_id, categories } = req.body;

    const result = await categoryService.createOrUpdateCategories({
      eventId: Number(eventId),
      stage_id,
      categories,
      userId,
    });

    res.status(200).json({
      message: "Categories synced successfully",
      categories: result,
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

async function getCategoriesByStage(req, res, next) {
  try {
    const { eventId, stageId } = req.params;

    const categories =
      await categoryService.getCategoriesByStage(
        Number(eventId),
        Number(stageId)
      );

    res.json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrUpdateCategories,
  getCategoriesByEvent,
  getCategoriesByStage,
};
