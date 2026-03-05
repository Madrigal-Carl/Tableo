function validateStageReport(req, res, next) {
  const { stageId } = req.params;

  if (!stageId || isNaN(stageId)) {
    return res.status(400).json({
      message: "Invalid stage ID",
    });
  }

  next();
}

module.exports = { validateStageReport };
