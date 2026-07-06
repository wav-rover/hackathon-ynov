import { apiRequest } from "@/api/client"
import type { components } from "@/api/schema"
import type { VetResult } from "@/components/results/VetResultItem"

export type VeterinaryClinic = components["schemas"]["VeterinaryClinic"]
export type VeterinaryClinicListResponse =
  components["schemas"]["VeterinaryClinicListResponse"]

export type NearbyClinicsParams = {
  lat: number
  lng: number
  distance?: 5 | 10 | 25 | 50
  openNow?: boolean
  open24_7?: boolean
  emergency?: boolean
  sort?: "nearest" | "rating"
  page?: number
  pageSize?: number
}

export function fetchNearbyClinics(params: NearbyClinicsParams) {
  const searchParams = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    ...(params.distance !== undefined ? { distance: String(params.distance) } : {}),
    ...(params.openNow !== undefined ? { openNow: String(params.openNow) } : {}),
    ...(params.open24_7 !== undefined ? { open24_7: String(params.open24_7) } : {}),
    ...(params.emergency !== undefined ? { emergency: String(params.emergency) } : {}),
    ...(params.sort !== undefined ? { sort: params.sort } : {}),
    ...(params.page !== undefined ? { page: String(params.page) } : {}),
    ...(params.pageSize !== undefined ? { pageSize: String(params.pageSize) } : {}),
  })

  return apiRequest<VeterinaryClinicListResponse>(
    `/veterinary-clinics?${searchParams.toString()}`
  )
}

function formatDistance(meters: number | null) {
  if (meters === null) return "—"
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

function formatHours(clinic: VeterinaryClinic) {
  if (clinic.isOpen24_7) return "Open 24/7"
  if (clinic.isOpenNow) return "Open now"
  return "Closed"
}

export function clinicToVetResult(clinic: VeterinaryClinic): VetResult {
  return {
    id: clinic.id,
    name: clinic.name ?? "Unnamed clinic",
    address: clinic.address ?? "",
    distance: formatDistance(clinic.distanceMeters),
    isOpenNow: clinic.isOpenNow ?? false,
    hours: formatHours(clinic),
    isEmergency: clinic.isEmergency,
    phone: clinic.phone ?? undefined,
    website: clinic.website ?? undefined,
    directionsUrl: clinic.googleMapsUrl ?? undefined,
    lat: clinic.location?.lat,
    lng: clinic.location?.lng,
  }
}
