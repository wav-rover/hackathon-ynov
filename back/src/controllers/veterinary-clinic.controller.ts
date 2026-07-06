import type { Request, Response } from "express";

import { HttpError } from "../errors/http-error.js";
import { veterinaryClinicService } from "../services/veterinary-clinic.service.js";
import type { NearbyClinicSearchParams } from "../types/veterinary-clinic.js";

type ValidationError = {
  field: string;
  message: string;
};

const DEFAULT_DISTANCE_KM: NearbyClinicSearchParams["distanceKm"] = 5;

function getFirstQueryValue(value: unknown) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseNumber(value: unknown) {
  return Number(getFirstQueryValue(value));
}

function parseCoordinate(
  query: Request["query"],
  primaryKey: string,
  aliasKey: string,
  min: number,
  max: number,
  errors: ValidationError[],
) {
  const rawValue = query[primaryKey] ?? query[aliasKey];
  const value = parseNumber(rawValue);

  if (rawValue === undefined || !Number.isFinite(value)) {
    errors.push({
      field: primaryKey,
      message: `${primaryKey} must be a number`,
    });
    return 0;
  }

  if (value < min || value > max) {
    errors.push({
      field: primaryKey,
      message: `${primaryKey} must be between ${min} and ${max}`,
    });
  }

  return value;
}

function parseBoolean(
  query: Request["query"],
  keys: string[],
  errors: ValidationError[],
) {
  const key = keys.find((item) => query[item] !== undefined);

  if (!key) {
    return undefined;
  }

  const rawValue = getFirstQueryValue(query[key]);

  if (typeof rawValue !== "string") {
    errors.push({ field: key, message: `${key} must be a boolean` });
    return undefined;
  }

  const value = rawValue.trim().toLowerCase();

  if (["true", "1", "yes"].includes(value)) {
    return true;
  }

  if (["false", "0", "no"].includes(value)) {
    return false;
  }

  errors.push({ field: key, message: `${key} must be true or false` });
  return undefined;
}

function parseInteger(
  query: Request["query"],
  key: string,
  defaultValue: number,
  min: number,
  max: number,
  errors: ValidationError[],
) {
  if (query[key] === undefined) {
    return defaultValue;
  }

  const value = parseNumber(query[key]);

  if (!Number.isInteger(value)) {
    errors.push({ field: key, message: `${key} must be an integer` });
    return defaultValue;
  }

  if (value < min || value > max) {
    errors.push({ field: key, message: `${key} must be between ${min} and ${max}` });
  }

  return value;
}

function parseDistanceKm(
  query: Request["query"],
  errors: ValidationError[],
): NearbyClinicSearchParams["distanceKm"] {
  const { limits } = veterinaryClinicService;
  const rawDistance = query.distance ?? query.distanceKm;
  const rawRadius = query.radius;
  const rawValue = rawDistance ?? rawRadius;

  if (rawValue === undefined) {
    return DEFAULT_DISTANCE_KM;
  }

  const normalizedRawValue = String(getFirstQueryValue(rawValue)).trim();
  const number = Number(normalizedRawValue.replace(/km$/i, ""));
  const distanceKm = rawRadius !== undefined && rawDistance === undefined
    ? number / 1000
    : number;

  if (!Number.isFinite(distanceKm)) {
    errors.push({
      field: rawRadius === undefined ? "distance" : "radius",
      message: "distance must be 5, 10, 25 or 50 kilometers",
    });
    return DEFAULT_DISTANCE_KM;
  }

  if (!limits.distanceOptionsKm.includes(distanceKm as 5 | 10 | 25 | 50)) {
    errors.push({
      field: rawRadius === undefined ? "distance" : "radius",
      message: "distance must be 5, 10, 25 or 50 kilometers",
    });
    return DEFAULT_DISTANCE_KM;
  }

  return distanceKm as 5 | 10 | 25 | 50;
}

function parseServices(query: Request["query"]) {
  const rawValue = query.services ?? query.service;
  const values = Array.isArray(rawValue) ? rawValue : [rawValue];

  return values
    .filter((value): value is string => typeof value === "string")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseSort(
  query: Request["query"],
  errors: ValidationError[],
): NearbyClinicSearchParams["sort"] {
  if (query.sort === undefined) {
    return "nearest";
  }

  const value = getFirstQueryValue(query.sort);

  if (value === "nearest" || value === "rating") {
    return value;
  }

  errors.push({
    field: "sort",
    message: "sort must be nearest or rating",
  });

  return "nearest";
}

function parseLanguage(query: Request["query"], errors: ValidationError[]) {
  if (query.language === undefined) {
    return "fr";
  }

  const value = getFirstQueryValue(query.language);

  if (typeof value !== "string") {
    errors.push({ field: "language", message: "language must be a string" });
    return "fr";
  }

  const language = value.trim();

  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(language)) {
    errors.push({
      field: "language",
      message: "language must look like fr or fr-FR",
    });
  }

  return language;
}

function validateNearbyClinicsQuery(query: Request["query"]) {
  const errors: ValidationError[] = [];
  const { limits } = veterinaryClinicService;
  const latitude = parseCoordinate(query, "latitude", "lat", -90, 90, errors);
  const longitude = parseCoordinate(query, "longitude", "lng", -180, 180, errors);
  const distanceKm = parseDistanceKm(query, errors);
  const openNow = parseBoolean(query, ["openNow", "open_now"], errors);
  const open24_7 = parseBoolean(
    query,
    ["open24_7", "open24", "isOpen24_7"],
    errors,
  );
  const emergency = parseBoolean(
    query,
    ["emergency", "emercency", "isEmergency"],
    errors,
  );
  const page = parseInteger(
    query,
    "page",
    limits.defaultPage,
    1,
    Number.MAX_SAFE_INTEGER,
    errors,
  );
  const pageSize = parseInteger(
    query,
    "pageSize",
    limits.defaultPageSize,
    1,
    limits.maxPageSize,
    errors,
  );
  const sort = parseSort(query, errors);
  const language = parseLanguage(query, errors);

  if (errors.length > 0) {
    throw new HttpError(400, "Invalid query parameters", errors);
  }

  return {
    latitude,
    longitude,
    distanceKm,
    ...(openNow === undefined ? {} : { openNow }),
    ...(open24_7 === undefined ? {} : { open24_7 }),
    ...(emergency === undefined ? {} : { emergency }),
    services: parseServices(query),
    sort,
    page,
    pageSize,
    language,
  };
}

export const veterinaryClinicController = {
  async findNearby(request: Request, response: Response) {
    const result = await veterinaryClinicService.findNearby(
      validateNearbyClinicsQuery(request.query),
    );

    response.json(result);
  },
};
