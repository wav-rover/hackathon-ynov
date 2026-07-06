import { HttpError } from "../errors/http-error.js";

export function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${field} is required`);
  }

  return value.trim();
}
