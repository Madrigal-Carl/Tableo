const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/events'); // make sure this folder exists
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = crypto.randomBytes(16).toString('hex') + ext;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
