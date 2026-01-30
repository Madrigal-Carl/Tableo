const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/auth"); // middleware
const {
  createCriterionController,
  getCriteriaController,
  updateCriteriaController, // renamed for multi-update
} = require("../controllers/criterion_controller");

// Async wrapper to handle errors and avoid crashing nodemon
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// CREATE CRITERIA
router.post(
  "/:categoryId/",
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

// UPDATE CRITERIA (multi-update)
router.put(
  "/:categoryId/",
  authenticate,
  asyncHandler(async (req, res) => {
    await updateCriteriaController(req, res);
  })
);

module.exports = router;
