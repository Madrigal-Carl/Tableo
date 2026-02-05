const express = require("express");
const router = express.Router();
const controller = require("../controllers/competition_score_controller");
const { validateBulkScores } = require("../validators/competition_score_validator");
const authMiddleware = require("../middlewares/auth");

router.post(
  "/:categoryId/scores",
  authMiddleware,
  validateBulkScores,
  controller.addOrUpdateBulkScores
);

module.exports = router;
