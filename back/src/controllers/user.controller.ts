import type { Request, Response } from "express";

import { userService } from "../services/user.service.js";
import { getCurrentUserId } from "../utils/current-user.js";
import { parseId } from "../utils/parse-id.js";

export const userController = {
  async create(request: Request, response: Response) {
    const user = await userService.create(request.body);

    response.status(201).json(user);
  },

  async findMany(_request: Request, response: Response) {
    const users = await userService.findMany();

    response.json(users);
  },

  async findById(request: Request, response: Response) {
    const user = await userService.findById(
      parseId(request.params.id),
      getCurrentUserId(request),
    );

    response.json(user);
  },

  async update(request: Request, response: Response) {
    const user = await userService.update(
      parseId(request.params.id),
      getCurrentUserId(request),
      request.body,
    );

    response.json(user);
  },

  async delete(request: Request, response: Response) {
    const user = await userService.delete(
      parseId(request.params.id),
      getCurrentUserId(request),
    );

    response.json(user);
  },
};
