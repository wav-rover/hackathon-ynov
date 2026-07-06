import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../errors/http-error.js";

export function notFound(
  _request: Request,
  _response: Response,
  _next: NextFunction,
) {
  throw new HttpError(404, "Route not found");
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Internal server error" });
}
