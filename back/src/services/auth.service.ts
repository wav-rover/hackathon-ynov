import { HttpError } from "../errors/http-error.js";
import { userRepository } from "../repositories/user.repository.js";
import { signToken } from "../utils/jwt.js";
import { verifyPassword } from "../utils/password.js";
import { requiredString } from "../utils/required-string.js";
import { withoutPassword } from "../utils/without-password.js";
import { userService } from "./user.service.js";

type CredentialsInput = {
  username: unknown;
  password: unknown;
};

export const authService = {
  async register(input: CredentialsInput) {
    const user = await userService.create(input);
    const token = signToken(user.id);

    return { token, user };
  },

  async login(input: CredentialsInput) {
    const username = requiredString(input.username, "username");
    const password = requiredString(input.password, "password");

    const user = await userRepository.findByUsername(username);

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new HttpError(401, "Invalid username or password");
    }

    return {
      token: signToken(user.id),
      user: withoutPassword(user),
    };
  },

  async me(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return withoutPassword(user);
  },
};
