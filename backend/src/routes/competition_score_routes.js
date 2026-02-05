const express = require("express");
const router = express.Router();
const controller = require("../controllers/competition_score_controller");
const { validateBulkScores } = require("../validators/competition_score_validator");
const requireAuth = require("../middlewares/auth");

// POST: create scores
router.post("/:categoryId/scores", requireAuth, validateBulkScores, controller.addOrUpdateBulkScores);

// PUT: update scores
router.put("/:categoryId/scores", requireAuth, validateBulkScores, controller.updateBulkScores);

// GET routes
router.get("/scores/category/:categoryId", requireAuth, controller.getScoresByCategory);
router.get("/scores/candidate/:candidateId", requireAuth, controller.getScoresByCandidate);

module.exports = router;
