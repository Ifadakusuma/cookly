import express from "express";
import multer from "multer";
import { UploadController } from "../controllers/uploadController.js";
import { ALLOWED_TYPES } from "../models/uploadModel.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
    cb(new Error("Format gambar harus jpg, png, atau webp"));
  },
});

router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Ukuran gambar maksimal 5 MB" : err.message;
      return res.status(400).json({ error: message });
    }
    UploadController.uploadImage(req, res);
  });
});

export default router;