import { prisma } from "../db.js";

type CreatePetData = {
  name: string;
  type: string;
  userId: number;
};

type UpdatePetData = {
  name?: string;
  type?: string;
};

export const petRepository = {
  findManyByUserId(userId: number) {
    return prisma.pet.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });
  },

  findById(id: number) {
    return prisma.pet.findUnique({
      where: { id },
    });
  },

  create(data: CreatePetData) {
    return prisma.pet.create({
      data,
    });
  },

  update(id: number, data: UpdatePetData) {
    return prisma.pet.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.pet.delete({
      where: { id },
    });
  },
};
