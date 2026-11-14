import { MotifModel } from "../models/motifModel.js";

export const MotifController = {
  async getAll(req, res) {
    try {
      const data = await MotifModel.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await MotifModel.getById(req.params.id);
      if (!data) return res.status(404).json({ error: "Motif tidak ditemukan" });
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
};
