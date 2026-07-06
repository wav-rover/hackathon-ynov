import { Router } from "express";

import { veterinaryClinicController } from "../controllers/veterinary-clinic.controller.js";
import { createRateLimiter } from "../middlewares/rate-limit.middleware.js";

export const veterinaryClinicRouter = Router();

const clinicSearchRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
});

veterinaryClinicRouter.get(
  "/",
  clinicSearchRateLimiter,
  veterinaryClinicController.findNearby,
);
