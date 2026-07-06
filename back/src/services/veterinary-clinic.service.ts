import { csvVeterinaryClinicRepository } from "../repositories/csv-veterinary-clinic.repository.js";
import { googleVeterinaryClinicRepository } from "../repositories/google-veterinary-clinic.repository.js";
import type {
  ClinicLocation,
  ClinicSource,
  NearbyClinicSearchParams,
  VeterinaryClinic,
} from "../types/veterinary-clinic.js";
import { getDistanceMeters } from "../utils/distance.js";

const DISTANCE_OPTIONS_KM = [5, 10, 25, 50] as const;
const DEFAULT_DISTANCE_KM = 5;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function normalizeText(value: string | null) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getDedupeKey(clinic: VeterinaryClinic) {
  const address = normalizeText(clinic.address);
  const name = normalizeText(clinic.name);

  if (clinic.id.startsWith("ChIJ")) {
    return `google:${clinic.id}`;
  }

  if (name && address) {
    return `name-address:${name}:${address}`;
  }

  return `id:${clinic.id}`;
}

function isLikelyDuplicate(
  clinic: VeterinaryClinic,
  existing: VeterinaryClinic,
) {
  if (getDedupeKey(clinic) === getDedupeKey(existing)) {
    return true;
  }

  if (!clinic.location || !existing.location) {
    return false;
  }

  return (
    normalizeText(clinic.name) === normalizeText(existing.name) &&
    getDistanceMeters(clinic.location, existing.location) <= 100
  );
}

function uniqueValues<T>(values: T[]) {
  return [...new Set(values)];
}

function mergeSources(
  existing: ClinicSource[],
  incoming: ClinicSource[],
): ClinicSource[] {
  return uniqueValues([...existing, ...incoming]);
}

function mergeClinic(
  existing: VeterinaryClinic,
  incoming: VeterinaryClinic,
): VeterinaryClinic {
  const preferIncoming = incoming.sources.includes("google");
  const primary = preferIncoming ? incoming : existing;
  const secondary = preferIncoming ? existing : incoming;

  return {
    ...primary,
    name: primary.name ?? secondary.name,
    isOpenNow: primary.isOpenNow ?? secondary.isOpenNow,
    isOpen24_7: primary.isOpen24_7 ?? secondary.isOpen24_7,
    rating: primary.rating ?? secondary.rating,
    userRatingsTotal: primary.userRatingsTotal ?? secondary.userRatingsTotal,
    phone: primary.phone ?? secondary.phone,
    address: primary.address ?? secondary.address,
    website: primary.website ?? secondary.website,
    googleMapsUrl: primary.googleMapsUrl ?? secondary.googleMapsUrl,
    location: primary.location ?? secondary.location,
    distanceMeters: primary.distanceMeters ?? secondary.distanceMeters,
    services: uniqueValues([...primary.services, ...secondary.services]),
    isEmergency: primary.isEmergency || secondary.isEmergency,
    types: uniqueValues([...primary.types, ...secondary.types]),
    sources: mergeSources(primary.sources, secondary.sources),
  };
}

function dedupeClinics(clinics: VeterinaryClinic[]) {
  return clinics.reduce<VeterinaryClinic[]>((result, clinic) => {
    const duplicateIndex = result.findIndex((existing) =>
      isLikelyDuplicate(clinic, existing),
    );

    if (duplicateIndex === -1) {
      result.push(clinic);
      return result;
    }

    const existing = result[duplicateIndex];

    if (existing) {
      result[duplicateIndex] = mergeClinic(existing, clinic);
    }

    return result;
  }, []);
}

function hasAllServices(clinic: VeterinaryClinic, services: string[]) {
  if (services.length === 0) {
    return true;
  }

  const clinicServices = clinic.services.map(normalizeText);

  return services
    .map((service) => normalizeText(service))
    .every((service) => clinicServices.includes(service));
}

function applyFilters(
  clinics: VeterinaryClinic[],
  params: NearbyClinicSearchParams,
) {
  return clinics.filter((clinic) => {
    if (
      clinic.distanceMeters === null ||
      clinic.distanceMeters > params.distanceKm * 1000
    ) {
      return false;
    }

    if (params.openNow === true && clinic.isOpenNow !== true) {
      return false;
    }

    if (params.open24_7 === true && clinic.isOpen24_7 !== true) {
      return false;
    }

    if (params.emergency === true && clinic.isEmergency !== true) {
      return false;
    }

    return hasAllServices(clinic, params.services);
  });
}

function nullableNumberForSort(value: number | null) {
  return value ?? Number.POSITIVE_INFINITY;
}

function nullableRatingForSort(value: number | null) {
  return value ?? Number.NEGATIVE_INFINITY;
}

function sortClinics(clinics: VeterinaryClinic[], sort: "nearest" | "rating") {
  return [...clinics].sort((left, right) => {
    if (sort === "rating") {
      const ratingDelta =
        nullableRatingForSort(right.rating) - nullableRatingForSort(left.rating);

      if (ratingDelta !== 0) {
        return ratingDelta;
      }
    }

    const distanceDelta =
      nullableNumberForSort(left.distanceMeters) -
      nullableNumberForSort(right.distanceMeters);

    if (distanceDelta !== 0) {
      return distanceDelta;
    }

    return nullableRatingForSort(right.rating) - nullableRatingForSort(left.rating);
  });
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;

  return items.slice(start, start + pageSize);
}

async function safeFindGoogleClinics(params: NearbyClinicSearchParams) {
  try {
    return await googleVeterinaryClinicRepository.findNearby({
      latitude: params.latitude,
      longitude: params.longitude,
      radiusMeters: params.distanceKm * 1000,
      language: params.language,
    });
  } catch (error) {
    console.error("Failed to fetch Google veterinary clinics", error);
    return [];
  }
}

function getMeta(total: number, page: number, pageSize: number) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: page * pageSize < total,
    hasPreviousPage: page > 1,
  };
}

export const veterinaryClinicService = {
  async findNearby(params: NearbyClinicSearchParams) {
    const [googleClinics, csvClinics] = await Promise.all([
      safeFindGoogleClinics(params),
      csvVeterinaryClinicRepository.findNearby({
        latitude: params.latitude,
        longitude: params.longitude,
        radiusMeters: params.distanceKm * 1000,
        language: params.language,
      }),
    ]);
    const clinics = sortClinics(
      applyFilters(dedupeClinics([...googleClinics, ...csvClinics]), params),
      params.sort,
    );

    return {
      clinics: paginate(clinics, params.page, params.pageSize),
      pagination: getMeta(clinics.length, params.page, params.pageSize),
      filters: {
        distanceKm: params.distanceKm,
        openNow: params.openNow ?? null,
        open24_7: params.open24_7 ?? null,
        services: params.services,
        emergency: params.emergency ?? null,
        sort: params.sort,
      },
      sources: {
        google: googleClinics.length,
        csv: csvClinics.length,
        merged: clinics.length,
      },
    };
  },

  limits: {
    distanceOptionsKm: DISTANCE_OPTIONS_KM,
    defaultDistanceKm: DEFAULT_DISTANCE_KM,
    defaultPage: DEFAULT_PAGE,
    defaultPageSize: DEFAULT_PAGE_SIZE,
    maxPageSize: MAX_PAGE_SIZE,
  },
};
