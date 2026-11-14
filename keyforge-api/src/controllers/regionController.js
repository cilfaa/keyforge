import { RegionModel } from "../models/regionModel.js";
import { createResourceController } from "../utils/createResourceController.js";

export const RegionController = createResourceController(RegionModel, "Daerah tidak ditemukan");
