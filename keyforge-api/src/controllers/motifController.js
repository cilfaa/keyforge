import { MotifModel } from "../models/motifModel.js";
import { createResourceController } from "../utils/createResourceController.js";

export const MotifController = createResourceController(MotifModel, "Motif tidak ditemukan");
