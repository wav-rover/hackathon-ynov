import { HttpError } from "../errors/http-error.js";
import { userRepository } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/password.js";
import { requiredString } from "../utils/required-string.js";
import { withoutPassword } from "../utils/without-password.js";

type CreateUserInput = {
  username: unknown;
  password: unknown;
};

type UpdateUserInput = {
  username?: unknown;
  password?: unknown;
};

async function ensureUsernameIsAvailable(username: string, currentUserId?: number) {
  const user = await userRepository.findByUsername(username);

  if (user && user.id !== currentUserId) {
    throw new HttpError(409, "Username already exists");
  }
}

function assertOwnUser(userId: number, currentUserId: number) {
  if (userId !== currentUserId) {
    throw new HttpError(403, "Forbidden");
  }
}

export const userService = {
  async create(input: CreateUserInput) {
    const username = requiredString(input.username, "username");
    const password = requiredString(input.password, "password");

    await ensureUsernameIsAvailable(username);

    const user = await userRepository.create({
      username,
      password: await hashPassword(password),
    });

    return withoutPassword(user);
  },

  async findMany() {
    const users = await userRepository.findMany();

    return users.map(withoutPassword);
  },

  async findById(id: number, currentUserId: number) {
    assertOwnUser(id, currentUserId);

    const user = await userRepository.findById(id);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return withoutPassword(user);
  },

  async update(id: number, currentUserId: number, input: UpdateUserInput) {
    assertOwnUser(id, currentUserId);

    const currentUser = await userRepository.findById(id);

    if (!currentUser) {
      throw new HttpError(404, "User not found");
    }

    const data: { username?: string; password?: string } = {};

    if ("username" in input && input.username !== undefined) {
      const username = requiredString(input.username, "username");
      await ensureUsernameIsAvailable(username, id);
      data.username = username;
    }

    if ("password" in input && input.password !== undefined) {
      const password = requiredString(input.password, "password");
      data.password = await hashPassword(password);
    }

    if (Object.keys(data).length === 0) {
      return withoutPassword(currentUser);
    }

    const user = await userRepository.update(id, data);

    return withoutPassword(user);
  },

  async delete(id: number, currentUserId: number) {
    assertOwnUser(id, currentUserId);

    const user = await userRepository.findById(id);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const deletedUser = await userRepository.delete(id);

    return withoutPassword(deletedUser);
  },
};
