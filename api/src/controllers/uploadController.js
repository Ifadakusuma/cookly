import { UploadModel } from "../models/uploadModel.js";

export const UploadController = {
  async uploadImage(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: "File gambar wajib ada" });
      const url = await UploadModel.uploadImage(req.file);
      res.status(201).json({ url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};