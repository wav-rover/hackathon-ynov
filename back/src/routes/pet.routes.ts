import { Router } from "express";

import { petController } from "../controllers/pet.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const petRouter = Router();

petRouter.use(authenticate);
petRouter.post("/", petController.create);
petRouter.get("/", petController.findMany);
petRouter.get("/:id", petController.findById);
petRouter.put("/:id", petController.update);
petRouter.delete("/:id", petController.delete);
