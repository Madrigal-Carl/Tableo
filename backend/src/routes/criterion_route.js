const express = require("express");
const router = express.Router();

const { createCriterionController } = require("../controllers/criterion_controller");
const authenticate = require("../middlewares/auth"); // ✅ Corrected import

// Async wrapper to handle errors and avoid crashing nodemon
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// POST /categories/:categoryId/create
router.post(
  "/:categoryId/create",
  authenticate,
  asyncHandler(async (req, res) => {
    // Merge categoryId from params into body for validator/service
    req.body.category_id = parseInt(req.params.categoryId, 10);

    // Call the controller
    await createCriterionController(req, res);
  })
);

module.exports = router;
