import { AuthModel } from "../models/authModel.js";

export const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password || String(password).length < 4) {
        return res.status(400).json({ error: "Nama, email, dan kata sandi (minimal 4 karakter) wajib diisi." });
      }
      const user = await AuthModel.register({ name, email, password });
      res.status(201).json(user);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email dan kata sandi wajib diisi." });
      }
      const user = await AuthModel.login({ email, password });
      res.json(user);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};
