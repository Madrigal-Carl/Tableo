const express = require("express");
const router = express.Router();
const controller = require("../controllers/competition_score_controller");
const { validateBulkScores } = require("../validators/competition_score_validator");
const authMiddleware = require("../middlewares/auth");

// POST: create scores
router.post(
  "/:categoryId/scores",
  authMiddleware,
  validateBulkScores,
  controller.addOrUpdateBulkScores
);

// PUT: update scores
router.put(
  "/:categoryId/scores",
  authMiddleware,
  validateBulkScores,
  controller.updateBulkScores
);

// GET routes
router.get("/scores/category/:categoryId", controller.getScoresByCategory);
router.get("/scores/candidate/:candidateId", controller.getScoresByCandidate);

module.exports = router;
