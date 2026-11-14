import express from "express";
import { OrderController } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getById);
router.post("/", OrderController.create);
router.patch("/:id/payment", OrderController.updatePayment);
router.patch("/:id/status", OrderController.updateStatus);

export default router;
