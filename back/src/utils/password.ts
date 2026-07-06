import * as bcrypt from "bcryptjs";

import { HttpError } from "../errors/http-error.js";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export function assertValidPassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(
      400,
      `password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    );
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new HttpError(
      400,
      `password must be at most ${MAX_PASSWORD_LENGTH} characters`,
    );
  }
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
