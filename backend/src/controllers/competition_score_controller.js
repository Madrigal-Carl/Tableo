const competitionScoreService = require("../services/competition_score_service");

/* =====================================================
   SUBMIT SCORES
===================================================== */
async function submitScores(req, res, next) {
  try {
    const scores = req.body; // array of scores

    const result = await competitionScoreService.submitScores(scores);

    // ✅ Get socket instance
    const io = req.app.get("io");

    // ✅ IMPORTANT:
    // Assume scores array contains category_id (you should confirm)
    const categoryId = scores[0]?.category_id;

    if (categoryId && io) {
      io.to(`category_${categoryId}`).emit(
        "category-status-updated",
        {
          categoryId,
          message: "Scores updated"
        }
      );
    }

    res.status(200).json({
      message: "Scores submitted successfully",
      result,
    });

  } catch (err) {
    next(err);
  }
}
/* =====================================================
   CHECK IF A SINGLE JUDGE COMPLETED CATEGORY
===================================================== */
async function checkCategoryCompletion(req, res, next) {
  try {
    const { categoryId } = req.params;

    const judgeId = req.judge.id; // from judge auth middleware

    const isCompleted =
      await competitionScoreService.hasCompletedCategory(
        judgeId,
        categoryId
      );

    res.status(200).json({
      completed: isCompleted,
    });
  } catch (err) {
    next(err);
  }
}

/* =====================================================
   GET ALL JUDGES STATUS FOR A CATEGORY
   (FOR WAITING OVERLAY)
===================================================== */
async function getJudgeStatuses(req, res, next) {
  try {
    const { categoryId } = req.params;

    const statuses =
      await competitionScoreService.getCategoryJudgeStatuses(categoryId);

    res.status(200).json(statuses);
  } catch (err) {
    next(err);
  }
}

/* ===================================================== */

module.exports = {
  submitScores,
  checkCategoryCompletion,
  getJudgeStatuses, // ✅ NEW
};