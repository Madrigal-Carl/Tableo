const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/auth"); // middleware
const {
  createCriterionController,
  getCriteriaController,
} = require("../controllers/criterion_controller");

// Async wrapper to handle errors and avoid crashing nodemon
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// CREATE CRITERIA
router.post(
  "/:categoryId/create",
  authenticate,
  asyncHandler(async (req, res) => {
    req.body.category_id = parseInt(req.params.categoryId, 10);
    await createCriterionController(req, res);
  })
);

// READ CRITERIA
router.get(
  "/:categoryId",
  authenticate,
  asyncHandler(async (req, res) => {
    await getCriteriaController(req, res);
  })
);

module.exports = router;
