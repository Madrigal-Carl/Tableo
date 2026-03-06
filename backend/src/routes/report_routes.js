const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/auth");
const reportController = require("../controllers/report_controller");
const { validateStageReport } = require("../validators/report_validator");

router.get(
  "/stage/:stageId/export",
  requireAuth,
  validateStageReport,
  reportController.exportStageReport,
);

module.exports = router;
