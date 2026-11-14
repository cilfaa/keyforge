import express from "express";
import { MotifController } from "../controllers/motifController.js";

const router = express.Router();

router.get("/", MotifController.getAll);
router.get("/:id", MotifController.getById);
router.post("/", MotifController.create);
router.put("/:id", MotifController.update);
router.delete("/:id", MotifController.remove);

export default router;
