import express from "express";
import { RegionController } from "../controllers/regionController.js";

const router = express.Router();

router.get("/", RegionController.getAll);
router.get("/:id", RegionController.getById);

export default router;
