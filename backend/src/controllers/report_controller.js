const reportService = require("../services/report_service");
const stageRepo = require("../repositories/stage_repository");

async function exportStageReport(req, res) {
  try {
    const { stageId } = req.params;

    const stageInfo = await stageRepo.findById(stageId);
    const stageName = stageInfo
      ? stageInfo.name.replace(/[^a-z0-9]/gi, "_")
      : "stage";

    const buffer = await reportService.generateStageReport(stageId);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${stageName}_report.docx"`,
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { exportStageReport };
