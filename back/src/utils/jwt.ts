import { createRequire } from "node:module";
import type { SignOptions } from "jsonwebtoken";

import { HttpError } from "../errors/http-error.js";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken") as typeof import("jsonwebtoken");

type JwtPayload = {
  userId: number;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return secret;
}

export function signToken(userId: number) {
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1d") as NonNullable<SignOptions["expiresIn"]>;
  const options: SignOptions = { expiresIn };

  return jwt.sign({ userId }, getJwtSecret(), options);
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.userId !== "number"
    ) {
      throw new HttpError(401, "Invalid token");
    }

    return payload as JwtPayload;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(401, "Invalid token");
  }
}
