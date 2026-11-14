import { RegionModel } from "../models/regionModel.js";

export const RegionController = {
  async getAll(req, res) {
    try {
      const data = await RegionModel.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await RegionModel.getById(req.params.id);
      if (!data) return res.status(404).json({ error: "Daerah tidak ditemukan" });
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
};
