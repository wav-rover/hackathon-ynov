import { Router } from "express";

import { userController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

// userRouter.post("/", userController.create);
userRouter.use(authenticate);
userRouter.get("/:id", userController.findById);
userRouter.put("/:id", userController.update);
userRouter.delete("/:id", userController.delete);
