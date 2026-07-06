import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  ClinicRepositorySearchParams,
  VeterinaryClinic,
} from "../types/veterinary-clinic.js";
import { getDistanceMeters } from "../utils/distance.js";

const CSV_PATH = path.join(process.cwd(), "data", "veterinary-clinics.csv");

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);

  return values;
}

function getCell(headers: string[], row: string[], key: string) {
  const index = headers.indexOf(key);

  if (index === -1) {
    return "";
  }

  return row[index] ?? "";
}

function parseBoolean(value: string) {
  return value.trim().toLowerCase() === "true";
}

function parseNullableBoolean(value: string) {
  if (value.trim() === "") {
    return null;
  }

  return parseBoolean(value);
}

function parseNullableNumber(value: string) {
  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function parseList(value: string) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapRow(
  headers: string[],
  row: string[],
  params: ClinicRepositorySearchParams,
): VeterinaryClinic {
  const location = {
    lat: Number(getCell(headers, row, "latitude")),
    lng: Number(getCell(headers, row, "longitude")),
  };
  const hasLocation =
    Number.isFinite(location.lat) && Number.isFinite(location.lng);

  return {
    id: getCell(headers, row, "id"),
    name: getCell(headers, row, "name") || null,
    isOperational: parseBoolean(getCell(headers, row, "isOperational")),
    isOpenNow: parseNullableBoolean(getCell(headers, row, "isOpenNow")),
    isOpen24_7: parseNullableBoolean(getCell(headers, row, "isOpen24_7")),
    rating: parseNullableNumber(getCell(headers, row, "rating")),
    userRatingsTotal: parseNullableNumber(
      getCell(headers, row, "userRatingsTotal"),
    ),
    phone: getCell(headers, row, "phone") || null,
    address: getCell(headers, row, "address") || null,
    website: getCell(headers, row, "website") || null,
    googleMapsUrl: getCell(headers, row, "googleMapsUrl") || null,
    location: hasLocation ? location : null,
    distanceMeters: hasLocation
      ? getDistanceMeters(
          { lat: params.latitude, lng: params.longitude },
          location,
        )
      : null,
    icon: {
      url: getCell(headers, row, "iconUrl") || null,
      backgroundColor: getCell(headers, row, "iconBackgroundColor") || null,
      maskBaseUri: getCell(headers, row, "iconMaskBaseUri") || null,
    },
    services: parseList(getCell(headers, row, "services")),
    isEmergency: parseBoolean(getCell(headers, row, "isEmergency")),
    types: parseList(getCell(headers, row, "types")),
    sources: ["csv"],
  };
}

export const csvVeterinaryClinicRepository = {
  async findNearby(params: ClinicRepositorySearchParams) {
    const content = await readFile(CSV_PATH, "utf8");
    const [headerLine, ...lines] = content
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);

    if (!headerLine) {
      return [];
    }

    const headers = parseCsvLine(headerLine);

    return lines
      .map((line) => mapRow(headers, parseCsvLine(line), params))
      .filter(
        (clinic) =>
          clinic.distanceMeters !== null &&
          clinic.distanceMeters <= params.radiusMeters,
      );
  },
};
