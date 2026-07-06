import type { Request } from "express";

import { HttpError } from "../errors/http-error.js";

export function getCurrentUserId(request: Request) {
  const userId = request.user?.id;

  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }

  return userId;
}
