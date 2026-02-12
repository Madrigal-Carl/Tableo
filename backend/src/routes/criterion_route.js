const express = require("express");
const router = express.Router({ mergeParams: true });

const requireAuth = require("../middlewares/auth");
const {
  createOrUpdateCriteriaController,
  getCriteriaController,
} = require("../controllers/criterion_controller");

// Async wrapper to handle errors
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// GET criteria by category
router.get(
  "/:categoryId/criteria",
  requireAuth,
  asyncHandler(getCriteriaController)
);

// CREATE OR UPDATE criteria (single endpoint)
router.post(
  "/:categoryId/criteria",
  requireAuth,
  asyncHandler(async (req, res) => {
    await createOrUpdateCriteriaController(req, res);
  })
);

module.exports = router;
