const { jsPDF } = require("jspdf");
const autoTable = require("jspdf-autotable").default;

const stageService = require("./stage_service");
const stageRepo = require("../repositories/stage_repository");
const eventRepo = require("../repositories/event_repository");

async function generateStageReport(stageId) {
  const stageResults = await stageService.getStageResults(stageId);
  const overallResults = await stageService.getStageOverallResults(stageId);

  const stageInfo = await stageRepo.findById(stageId);
  const stageName = stageInfo ? stageInfo.name : "STAGE";

  const eventInfo = stageInfo
    ? await eventRepo.findById(stageInfo.event_id)
    : null;

  const eventName = eventInfo ? eventInfo.title : "EVENT";

  const doc = new jsPDF();

  let y = 20;

  // EVENT TITLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(eventName, 105, y, { align: "center" });

  y += 8;

  // STAGE TITLE (smaller)
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.text(stageName, 105, y, { align: "center" });

  y += 12;

  // --------------------
  // CATEGORIES TITLE
  // --------------------
  doc.setFontSize(16);
  doc.text("Categories", 14, y);

  y += 10; // two line spacing

  const categories = Object.keys(stageResults);

  for (const category of categories) {
    const data = stageResults[category];
    const sample = data.males[0] || data.females[0];

    const judgeNames = sample?.judge_scores.map((j) => j.name) || [];

    const headers = [
      "No.",
      "Participants",
      ...judgeNames,
      "Average",
      "Ranking",
    ];

    // CATEGORY TITLE
    doc.setFontSize(14);
    doc.text(`Category: ${category}`, 14, y);
    y += 8;

    // MEN TABLE
    doc.setFontSize(12);
    doc.text("Men", 14, y);
    y += 4;

    const maleRows = data.males.map((c) => [
      c.sequence,
      c.name,
      ...c.judge_scores.map((j) => Number(j.score).toFixed(2)),
      Number(c.total_average).toFixed(2),
      c.rank,
    ]);

    autoTable(doc, {
      startY: y,
      head: [headers],
      body: maleRows,
      styles: { halign: "center", fontSize: 9 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    y = doc.lastAutoTable.finalY + 6;

    // WOMEN TABLE
    doc.text("Women", 14, y);
    y += 4;

    const femaleRows = data.females.map((c) => [
      c.sequence,
      c.name,
      ...c.judge_scores.map((j) => Number(j.score).toFixed(2)),
      Number(c.total_average).toFixed(2),
      c.rank,
    ]);

    autoTable(doc, {
      startY: y,
      head: [headers],
      body: femaleRows,
      styles: { halign: "center", fontSize: 9 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    y = doc.lastAutoTable.finalY + 12; // spacing between categories
  }

  // --------------------
  // OVERALL SUMMARY
  // --------------------

  y += 6; // extra spacing before section

  doc.setFontSize(16);
  doc.text("Overall Summary", 14, y);

  y += 10; // two line spacing

  if (overallResults.males.length > 0) {
    doc.setFontSize(12);
    doc.text("Male Overall", 14, y);
    y += 4;

    const rows = overallResults.males.map((c) => [
      c.sequence,
      c.name,
      Number(c.stage_total).toFixed(2),
      c.rank,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["No.", "Participants", "Average", "Ranking"]],
      body: rows,
      styles: { halign: "center", fontSize: 9 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  if (overallResults.females.length > 0) {
    doc.text("Female Overall", 14, y);
    y += 4;

    const rows = overallResults.females.map((c) => [
      c.sequence,
      c.name,
      Number(c.stage_total).toFixed(2),
      c.rank,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["No.", "Participants", "Average", "Ranking"]],
      body: rows,
      styles: { halign: "center", fontSize: 9 },
      headStyles: { fillColor: [200, 200, 200] },
    });
  }

  return Buffer.from(doc.output("arraybuffer"));
}

module.exports = {
  generateStageReport,
};
