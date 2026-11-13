import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import keyboardRoutes from "./routes/keyboardRoutes.js";
import switchRoutes from "./routes/switchRoutes.js";

dotenv.config();

const app = express();
app.use(cors()); // supaya aplikasi PWA boleh mengambil data dari API ini
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "KeyForge API berjalan", endpoints: ["/api/keyboards", "/api/switches"] });
});

app.use("/api/keyboards", keyboardRoutes);
app.use("/api/switches", switchRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
