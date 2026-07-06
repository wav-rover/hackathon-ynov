import { HttpError } from "../errors/http-error.js";
import { petRepository } from "../repositories/pet.repository.js";
import { requiredString } from "../utils/required-string.js";

type CreatePetInput = {
  name: unknown;
  type: unknown;
};

type UpdatePetInput = {
  name?: unknown;
  type?: unknown;
};

async function findOwnedPet(id: number, currentUserId: number) {
  const pet = await petRepository.findById(id);

  if (!pet) {
    throw new HttpError(404, "Pet not found");
  }

  if (pet.userId !== currentUserId) {
    throw new HttpError(403, "Forbidden");
  }

  return pet;
}

export const petService = {
  findMany(currentUserId: number) {
    return petRepository.findManyByUserId(currentUserId);
  },

  findById(id: number, currentUserId: number) {
    return findOwnedPet(id, currentUserId);
  },

  create(currentUserId: number, input: CreatePetInput) {
    const name = requiredString(input.name, "name");
    const type = requiredString(input.type, "type");

    return petRepository.create({
      name,
      type,
      userId: currentUserId,
    });
  },

  async update(id: number, currentUserId: number, input: UpdatePetInput) {
    const currentPet = await findOwnedPet(id, currentUserId);
    const data: { name?: string; type?: string } = {};

    if ("name" in input && input.name !== undefined) {
      data.name = requiredString(input.name, "name");
    }

    if ("type" in input && input.type !== undefined) {
      data.type = requiredString(input.type, "type");
    }

    if (Object.keys(data).length === 0) {
      return currentPet;
    }

    return petRepository.update(id, data);
  },

  async delete(id: number, currentUserId: number) {
    await findOwnedPet(id, currentUserId);

    return petRepository.delete(id);
  },
};
