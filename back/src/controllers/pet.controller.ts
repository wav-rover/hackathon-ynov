import type { Request, Response } from "express";

import { petService } from "../services/pet.service.js";
import { getCurrentUserId } from "../utils/current-user.js";
import { parseId } from "../utils/parse-id.js";

export const petController = {
  async create(request: Request, response: Response) {
    const pet = await petService.create(getCurrentUserId(request), request.body);

    response.status(201).json(pet);
  },

  async findMany(request: Request, response: Response) {
    const pets = await petService.findMany(getCurrentUserId(request));

    response.json(pets);
  },

  async findById(request: Request, response: Response) {
    const pet = await petService.findById(
      parseId(request.params.id),
      getCurrentUserId(request),
    );

    response.json(pet);
  },

  async update(request: Request, response: Response) {
    const pet = await petService.update(
      parseId(request.params.id),
      getCurrentUserId(request),
      request.body,
    );

    response.json(pet);
  },

  async delete(request: Request, response: Response) {
    const pet = await petService.delete(
      parseId(request.params.id),
      getCurrentUserId(request),
    );

    response.json(pet);
  },
};
