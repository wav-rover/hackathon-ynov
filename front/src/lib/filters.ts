export type DistanceKm = 5 | 10 | 25 | 50

export type SortValue = "nearest" | "rating"

export type ClinicFilters = {
  distance: DistanceKm
  openNow: boolean
  open24_7: boolean
  emergency: boolean
  services: string[]
  sort: SortValue
}

export const DEFAULT_FILTERS: ClinicFilters = {
  distance: 10,
  openNow: false,
  open24_7: false,
  emergency: false,
  services: [],
  sort: "nearest",
}

export const DISTANCE_OPTIONS: DistanceKm[] = [5, 10, 25, 50]

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "nearest", label: "Distance" },
  { value: "rating", label: "Rating" },
]

/**
 * Specialist services offered as filters. Values must match the `services`
 * entries in the clinic data (see back/data/veterinary-clinics.csv).
 * `oncology` has no seed data yet but is offered per product requirement.
 */
export const SPECIALTIES: { value: string; label: string }[] = [
  { value: "cardiology", label: "Cardiology" },
  { value: "oncology", label: "Oncology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "dentistry", label: "Dentistry" },
  { value: "imaging", label: "Imaging" },
  { value: "surgery", label: "Surgery" },
]

const SPECIALTY_LABELS = new Map(
  SPECIALTIES.map((specialty) => [specialty.value, specialty.label]),
)

export function formatServiceLabel(value: string) {
  return (
    SPECIALTY_LABELS.get(value) ??
    value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  )
}

export function countActiveFilters(filters: ClinicFilters) {
  let count = 0
  if (filters.emergency) count += 1
  if (filters.openNow) count += 1
  if (filters.open24_7) count += 1
  count += filters.services.length
  return count
}
