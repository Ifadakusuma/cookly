import { RecipeModel } from "../models/recipeModel.js";

// Bahan dan langkah disimpan sebagai teks, satu item per baris.
// Menerima array atau teks biasa; baris kosong dibuang.
function toText(value) {
  const lines = Array.isArray(value) ? value : String(value ?? "").split("\n");
  return lines
    .map((line) => String(line).trim())
    .filter(Boolean)
    .join("\n");
}

export const RecipeController = {
  async getAll(req, res) {
    try {
      const { search, category_id } = req.query;
      if (category_id && !/^\d+$/.test(category_id)) {
        return res.status(400).json({ error: "category_id tidak valid" });
      }
      const recipes = await RecipeModel.getAll({ search, categoryId: category_id });
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const recipe = await RecipeModel.getById(req.params.id);
      if (!recipe) return res.status(404).json({ error: "Resep tidak ditemukan" });
      res.json(recipe);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { title, description, image_url, category_id, client_id } = req.body;
      const ingredients = toText(req.body.ingredients);
      const steps = toText(req.body.steps);

      if (!title || title.trim().length < 3)
        return res.status(400).json({ error: "Judul minimal 3 karakter" });
      if (!ingredients) return res.status(400).json({ error: "Bahan wajib diisi" });
      if (!steps) return res.status(400).json({ error: "Langkah wajib diisi" });
      if (!category_id) return res.status(400).json({ error: "Kategori wajib dipilih" });

      const recipe = await RecipeModel.create({
        title: title.trim(),
        description: description?.trim() || null,
        ingredients,
        steps,
        image_url: image_url || null,
        category_id,
        client_id: client_id || null,
      });
      res.status(201).json(recipe);
    } catch (err) {
      // client_id sudah ada: kiriman ulang dari antrean offline, kembalikan data yang sama
      if (err.code === "23505" && req.body.client_id) {
        const existing = await RecipeModel.getByClientId(req.body.client_id);
        return res.json(existing);
      }
      if (err.code === "23503")
        return res.status(400).json({ error: "Kategori tidak valid" });
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { title, description, image_url, category_id } = req.body;
      const changes = {};

      if (title !== undefined) changes.title = title.trim();
      if (description !== undefined) changes.description = description.trim() || null;
      if (image_url !== undefined) changes.image_url = image_url || null;
      if (category_id !== undefined) changes.category_id = category_id;

      if (req.body.ingredients !== undefined) {
        const ingredients = toText(req.body.ingredients);
        if (!ingredients) return res.status(400).json({ error: "Bahan wajib diisi" });
        changes.ingredients = ingredients;
      }
      if (req.body.steps !== undefined) {
        const steps = toText(req.body.steps);
        if (!steps) return res.status(400).json({ error: "Langkah wajib diisi" });
        changes.steps = steps;
      }

      if (Object.keys(changes).length === 0)
        return res.status(400).json({ error: "Tidak ada data yang diubah" });

      const recipe = await RecipeModel.update(req.params.id, changes);
      if (!recipe) return res.status(404).json({ error: "Resep tidak ditemukan" });
      res.json(recipe);
    } catch (err) {
      if (err.code === "23503")
        return res.status(400).json({ error: "Kategori tidak valid" });
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await RecipeModel.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Resep tidak ditemukan" });
      res.json({ message: "Resep dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};