import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import motifRoutes from "./routes/motifRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "WastraKu API berjalan",
    endpoints: ["/api/motifs", "/api/regions"],
  });
});

app.use("/api/motifs", motifRoutes);
app.use("/api/regions", regionRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
