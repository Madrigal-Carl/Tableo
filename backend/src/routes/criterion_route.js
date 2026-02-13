// routes/criterion_routes.js
const express = require("express");
const router = express.Router({ mergeParams: true });

const requireAuth = require("../middlewares/auth");
const { validateCriteria } = require("../validators/criterion_validator");
const {
  upsertCriteria,
  getCriteria,
} = require("../controllers/criterion_controller");

router.get(
  "/:categoryId/criteria",
  requireAuth,
  getCriteria
);

router.post(
  "/:categoryId/criteria",
  requireAuth,
  validateCriteria,
  upsertCriteria
);

module.exports = router;
