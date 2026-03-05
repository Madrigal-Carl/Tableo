const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ProtectionType,
} = require("docx");

const stageService = require("./stage_service");
const stageRepo = require("../repositories/stage_repository");

async function generateStageReport(stageId) {
  const stageResults = await stageService.getStageResults(stageId);
  const overallResults = await stageService.getStageOverallResults(stageId);

  // Fetch stage info to get the stage name
  const stageInfo = await stageRepo.findById(stageId);
  const stageName = stageInfo ? stageInfo.name : "STAGE";

  const children = [];

  // STAGE TITLE (centered, bold, Arial, size 18)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: stageName,
          bold: true,
          size: 36, // 18pt
          font: "Arial",
        }),
      ],
    }),
  );

  children.push(new Paragraph("")); // spacing

  // CATEGORY TABLES
  buildCategoryTables(stageResults, children);

  children.push(new Paragraph(""));
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Overall Summary",
          bold: true,
          size: 28, // 14pt
          font: "Arial",
        }),
      ],
    }),
  );
  children.push(new Paragraph(""));

  // OVERALL TABLE
  children.push(createOverallTable(overallResults));

  const doc = new Document({
    protection: {
      edit: ProtectionType.READ_ONLY,
      enforcement: true,
    },
    sections: [
      {
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

function buildCategoryTables(stageResults, children) {
  const categories = Object.keys(stageResults);

  for (const category of categories) {
    const data = stageResults[category];
    const sample = data.males[0] || data.females[0];

    // Get judge names from sample candidate
    const judgeNames = sample?.judge_scores.map((j) => j.name) || [];

    const headers = [
      "No.",
      "Participants",
      ...judgeNames,
      "Average",
      "Ranking",
    ];

    // Category title (bold, Arial, size 14)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Category: ${category}`,
            bold: true,
            size: 28,
            font: "Arial",
          }),
        ],
      }),
    );

    // Men table
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Men", bold: true, font: "Arial", size: 24 }),
        ],
      }),
    );
    children.push(createTable(headers, data.males));

    // Women table
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Women", bold: true, font: "Arial", size: 24 }),
        ],
      }),
    );
    children.push(createTable(headers, data.females));

    children.push(new Paragraph("")); // spacing after each category
  }
}

function createTable(headers, data) {
  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  font: "Arial",
                  size: 24, // 12pt
                }),
              ],
            }),
          ],
        }),
    ),
  });

  const rows = data.map((c) => {
    const cells = [
      c.sequence,
      c.name,
      ...c.judge_scores.map((j) => Number(j.score).toFixed(2)),
      Number(c.total_average).toFixed(2),
      c.rank,
    ];

    return new TableRow({
      children: cells.map(
        (cell) =>
          new TableCell({
            width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: String(cell ?? ""),
                    font: "Arial",
                    size: 24, // 12pt
                  }),
                ],
              }),
            ],
          }),
      ),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...rows],
  });
}

function createOverallTable(overallResults) {
  const headers = ["No.", "Participants", "Average", "Ranking"];
  const all = [...overallResults.males, ...overallResults.females];

  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  font: "Arial",
                  size: 24, // 12pt
                }),
              ],
            }),
          ],
        }),
    ),
  });

  const rows = all.map(
    (c) =>
      new TableRow({
        children: [
          c.sequence, // <-- use the candidate sequence here
          c.name,
          Number(c.stage_total).toFixed(2),
          c.rank,
        ].map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: String(cell ?? ""),
                      font: "Arial",
                      size: 24, // 12pt
                    }),
                  ],
                }),
              ],
            }),
        ),
      }),
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...rows],
  });
}

module.exports = {
  generateStageReport,
};
