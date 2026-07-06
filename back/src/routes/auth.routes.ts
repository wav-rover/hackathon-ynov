import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createRateLimiter } from "../middlewares/rate-limit.middleware.js";

export const authRouter = Router();

const registerRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: "Too many registration attempts, please try again later",
});
const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many login attempts, please try again later",
});

authRouter.post("/register", registerRateLimiter, authController.register);
authRouter.post("/login", loginRateLimiter, authController.login);
authRouter.get("/me", authenticate, authController.me);
