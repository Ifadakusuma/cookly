import { CategoryModel } from "../models/categoryModel.js";

export const CategoryController = {
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.getAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      if (!category) return res.status(404).json({ error: "Kategori tidak ditemukan" });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: "Nama kategori minimal 2 karakter" });
      }
      const category = await CategoryModel.create({ name: name.trim() });
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { name } = req.body;
      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: "Nama kategori minimal 2 karakter" });
      }
      const category = await CategoryModel.update(req.params.id, { name: name.trim() });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await CategoryModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      const status = err.message.includes("masih digunakan") ? 400 : 500;
      res.status(status).json({ error: err.message });
    }
  },
};