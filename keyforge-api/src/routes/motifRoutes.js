import express from "express";
import { MotifController } from "../controllers/motifController.js";

const router = express.Router();

router.get("/", MotifController.getAll);
router.get("/:id", MotifController.getById);

export default router;
