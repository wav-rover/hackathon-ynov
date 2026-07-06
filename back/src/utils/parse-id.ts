import { HttpError } from "../errors/http-error.js";

export function parseId(value: string | string[] | undefined, field = "id") {
  if (Array.isArray(value)) {
    throw new HttpError(400, `Invalid ${field}`);
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `Invalid ${field}`);
  }

  return id;
}
