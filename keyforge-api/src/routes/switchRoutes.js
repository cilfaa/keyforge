import express from "express";
import { SwitchController } from "../controllers/switchController.js";

const router = express.Router();

router.get("/", SwitchController.getAll);
router.get("/:id", SwitchController.getById);
router.post("/", SwitchController.create);
router.put("/:id", SwitchController.update);
router.delete("/:id", SwitchController.remove);

export default router;
