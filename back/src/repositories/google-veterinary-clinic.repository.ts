import { HttpError } from "../errors/http-error.js";
import type {
  ClinicLocation,
  ClinicRepositorySearchParams,
  VeterinaryClinic,
} from "../types/veterinary-clinic.js";
import { getDistanceMeters } from "../utils/distance.js";

const PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";
const GOOGLE_RESULT_LIMIT = 20;

type GooglePlace = {
  place_id: string;
  name?: string;
  business_status?: string;
  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open?: {
        day?: number;
        time?: string;
      };
      close?: {
        day?: number;
        time?: string;
      };
    }>;
  };
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  international_phone_number?: string;
  formatted_address?: string;
  vicinity?: string;
  website?: string;
  url?: string;
  geometry?: {
    location?: ClinicLocation;
  };
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  types?: string[];
};

type GoogleNearbyResponse = {
  status: string;
  error_message?: string;
  results?: GooglePlace[];
};

type GoogleDetailsResponse = {
  status: string;
  error_message?: string;
  result?: GooglePlace;
};

function getApiKey() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set");
  }

  return apiKey;
}

function buildPlacesUrl(path: string, params: Record<string, string | number>) {
  const url = new URL(`${PLACES_BASE_URL}/${path}/json`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  url.searchParams.set("key", getApiKey());

  return url;
}

async function fetchJson<T>(url: URL) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new HttpError(502, "Google Places request failed", {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return (await response.json()) as T;
}

function assertGoogleStatus(status: string, errorMessage?: string) {
  if (status === "OK" || status === "ZERO_RESULTS") {
    return;
  }

  throw new HttpError(502, "Google Places returned an error", {
    status,
    message: errorMessage,
  });
}

async function fetchNearbyPlaces(params: ClinicRepositorySearchParams) {
  const url = buildPlacesUrl("nearbysearch", {
    location: `${params.latitude},${params.longitude}`,
    radius: params.radiusMeters,
    type: "veterinary_care",
    language: params.language,
  });
  const data = await fetchJson<GoogleNearbyResponse>(url);

  assertGoogleStatus(data.status, data.error_message);

  return (data.results ?? []).slice(0, GOOGLE_RESULT_LIMIT);
}

async function fetchPlaceDetails(placeId: string, language: string) {
  const url = buildPlacesUrl("details", {
    place_id: placeId,
    language,
    fields: [
      "place_id",
      "name",
      "business_status",
      "opening_hours",
      "rating",
      "user_ratings_total",
      "formatted_phone_number",
      "international_phone_number",
      "formatted_address",
      "website",
      "url",
      "geometry",
      "icon",
      "icon_background_color",
      "icon_mask_base_uri",
      "types",
    ].join(","),
  });
  const data = await fetchJson<GoogleDetailsResponse>(url);

  if (data.status !== "OK") {
    return null;
  }

  return data.result ?? null;
}

function isOpen24_7(place: GooglePlace) {
  const periods = place.opening_hours?.periods;

  if (!periods || periods.length === 0) {
    return null;
  }

  return periods.some(
    (period) =>
      period.open?.day === 0 &&
      period.open.time === "0000" &&
      period.close === undefined,
  );
}

function mapClinic(
  place: GooglePlace,
  details: GooglePlace | null,
  userLocation: ClinicLocation,
): VeterinaryClinic {
  const source = details ?? place;
  const location = source.geometry?.location ?? null;

  return {
    id: source.place_id,
    name: source.name ?? null,
    isOperational: source.business_status === "OPERATIONAL",
    isOpenNow: source.opening_hours?.open_now ?? null,
    isOpen24_7: isOpen24_7(source),
    rating: source.rating ?? null,
    userRatingsTotal: source.user_ratings_total ?? null,
    phone:
      source.international_phone_number ?? source.formatted_phone_number ?? null,
    address: source.formatted_address ?? source.vicinity ?? place.vicinity ?? null,
    website: source.website ?? null,
    googleMapsUrl: source.url ?? null,
    location,
    distanceMeters: location
      ? getDistanceMeters(userLocation, location)
      : null,
    icon: {
      url: source.icon ?? null,
      backgroundColor: source.icon_background_color ?? null,
      maskBaseUri: source.icon_mask_base_uri ?? null,
    },
    services: ["consultation"],
    isEmergency: false,
    types: source.types ?? [],
    sources: ["google"],
  };
}

export const googleVeterinaryClinicRepository = {
  async findNearby(params: ClinicRepositorySearchParams) {
    const places = await fetchNearbyPlaces(params);
    const userLocation = {
      lat: params.latitude,
      lng: params.longitude,
    };
    const details = await Promise.all(
      places.map((place) => fetchPlaceDetails(place.place_id, params.language)),
    );

    return places.map((place, index) =>
      mapClinic(place, details[index] ?? null, userLocation),
    );
  },
};
