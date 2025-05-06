// middleware/uploadZip.js
import multer from "multer";
import path from "path";

// store file in memory as a Buffer
const storage = multer.memoryStorage();
const allowedMimes = [
    "application/zip",
    "application/x-zip-compressed", // Windows/Browsers :contentReference[oaicite:4]{index=4}
    "application/octet-stream", // fallback generic
];

const allowedExts = [".zip"];
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: (req, file, cb) => {
        const mimeOK = allowedMimes.includes(file.mimetype);
        const extOK = allowedExts.includes(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimeOK && extOK) {
            return cb(null, true);
        }
        cb(new Error("Only ZIP files are allowed"), false);
    },
});

export default upload.single("reportZip");
