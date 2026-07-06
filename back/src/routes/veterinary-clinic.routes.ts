import { Router } from "express";

import { veterinaryClinicController } from "../controllers/veterinary-clinic.controller.js";

export const veterinaryClinicRouter = Router();

veterinaryClinicRouter.get("/", veterinaryClinicController.findNearby);
