import { ReviewModel } from "../models/reviewModel.js";

export const ReviewController = {
  async getByRecipe(req, res) {
    try {
      const reviews = await ReviewModel.getByRecipe(req.params.id);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { reviewer_name, comment, client_id } = req.body;
      const rating = parseInt(req.body.rating);

      if (!reviewer_name || !reviewer_name.trim())
        return res.status(400).json({ error: "Nama wajib diisi" });
      if (!(rating >= 1 && rating <= 5))
        return res.status(400).json({ error: "Rating harus 1 sampai 5" });

      const review = await ReviewModel.create({
        recipe_id: req.params.id,
        reviewer_name: reviewer_name.trim(),
        rating,
        comment: comment?.trim() || null,
        client_id: client_id || null,
      });
      res.status(201).json(review);
    } catch (err) {
      if (err.code === "23505" && req.body.client_id) {
        const existing = await ReviewModel.getByClientId(req.body.client_id);
        return res.json(existing);
      }
      if (err.code === "23503")
        return res.status(404).json({ error: "Resep tidak ditemukan" });
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const changes = {};
      if (req.body.rating !== undefined) {
        const rating = parseInt(req.body.rating);
        if (!(rating >= 1 && rating <= 5))
          return res.status(400).json({ error: "Rating harus 1 sampai 5" });
        changes.rating = rating;
      }
      if (req.body.comment !== undefined) changes.comment = req.body.comment.trim() || null;

      if (Object.keys(changes).length === 0)
        return res.status(400).json({ error: "Tidak ada data yang diubah" });

      const review = await ReviewModel.update(req.params.id, changes);
      if (!review) return res.status(404).json({ error: "Review tidak ditemukan" });
      res.json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await ReviewModel.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Review tidak ditemukan" });
      res.json({ message: "Review dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};