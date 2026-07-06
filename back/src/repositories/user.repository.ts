import { prisma } from "../db.js";

type CreateUserData = {
  username: string;
  password: string;
};

type UpdateUserData = {
  username?: string;
  password?: string;
};

export const userRepository = {
  findMany() {
    return prisma.user.findMany({
      include: { pets: true },
      orderBy: { id: "asc" },
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { pets: true },
    });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  create(data: CreateUserData) {
    return prisma.user.create({
      data,
      include: { pets: true },
    });
  },

  update(id: number, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
      include: { pets: true },
    });
  },

  delete(id: number) {
    return prisma.user.delete({
      where: { id },
      include: { pets: true },
    });
  },
};
