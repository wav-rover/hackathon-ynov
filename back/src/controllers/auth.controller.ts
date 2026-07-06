import type { Request, Response } from "express";

import { authService } from "../services/auth.service.js";
import { getCurrentUserId } from "../utils/current-user.js";

export const authController = {
  async register(request: Request, response: Response) {
    const result = await authService.register(request.body);

    response.status(201).json(result);
  },

  async login(request: Request, response: Response) {
    const result = await authService.login(request.body);

    response.json(result);
  },

  async me(request: Request, response: Response) {
    const user = await authService.me(getCurrentUserId(request));

    response.json(user);
  },
};
