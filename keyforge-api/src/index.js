import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import keyboardRoutes from "./routes/keyboardRoutes.js";
import switchRoutes from "./routes/switchRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(cors()); // supaya aplikasi PWA boleh mengambil data dari API ini
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "KeyForge API berjalan",
    endpoints: ["/api/keyboards", "/api/switches", "/api/auth", "/api/orders"],
  });
});

app.use("/api/keyboards", keyboardRoutes);
app.use("/api/switches", switchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
