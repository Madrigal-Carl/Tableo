import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "events",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            { width: 1200, height: 630, crop: "limit", quality: "auto" }
        ],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 2MB
});

export default upload;
