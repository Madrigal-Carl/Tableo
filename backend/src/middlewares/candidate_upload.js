const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const candidateUploadPath = "uploads/candidates";
if (!fs.existsSync(candidateUploadPath)) {
  fs.mkdirSync(candidateUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, candidateUploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
