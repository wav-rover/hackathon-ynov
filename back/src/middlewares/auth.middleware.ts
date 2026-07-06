import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../errors/http-error.js";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const authorization = request.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization token is required");
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    throw new HttpError(401, "Authorization token is required");
  }

  const payload = verifyToken(token);
  request.user = { id: payload.userId };

  next();
}
