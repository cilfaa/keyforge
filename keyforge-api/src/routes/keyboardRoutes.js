import express from "express";
import { KeyboardController } from "../controllers/keyboardController.js";

const router = express.Router();

router.get("/", KeyboardController.getAll);
router.get("/:id", KeyboardController.getById);
router.post("/", KeyboardController.create);
router.put("/:id", KeyboardController.update);
router.delete("/:id", KeyboardController.remove);

export default router;
