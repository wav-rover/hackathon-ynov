import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { fetchNearbyClinics } from "@/api/clinics"
import type { VeterinaryClinic } from "@/api/clinics"
import type { ClinicFilters } from "@/lib/filters"

const DEFAULT_CENTER = { lat: 48.8566, lng: 2.3522 }

type MapCenter = {
  lat: number
  lng: number
}

function getUserPosition(): Promise<MapCenter> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  })
}

export function useNearbyClinics(filters: ClinicFilters) {
  const [center, setCenter] = useState<MapCenter>(DEFAULT_CENTER)
  const [clinics, setClinics] = useState<VeterinaryClinic[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Whether the initial geolocation attempt has settled. The fetch below waits
  // for this so we don't fire once against DEFAULT_CENTER and again once the
  // real position resolves.
  const [geoSettled, setGeoSettled] = useState(false)

  // Geolocate once on mount; keep DEFAULT_CENTER if it fails or is denied.
  useEffect(() => {
    let cancelled = false

    getUserPosition()
      .then((position) => {
        if (!cancelled) setCenter(position)
      })
      .catch(() => {
        // Silent on first load — the default center is a reasonable fallback.
      })
      .finally(() => {
        if (!cancelled) setGeoSettled(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Refetch whenever the center or any filter changes (after geolocation settles).
  useEffect(() => {
    if (!geoSettled) return

    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchNearbyClinics({
          lat: center.lat,
          lng: center.lng,
          distance: filters.distance,
          openNow: filters.openNow || undefined,
          open24_7: filters.open24_7 || undefined,
          emergency: filters.emergency || undefined,
          services: filters.services,
          sort: filters.sort,
          pageSize: 50,
        })

        if (cancelled) return

        setClinics(response.clinics)
        setTotal(response.pagination.total)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load clinics")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [
    geoSettled,
    center.lat,
    center.lng,
    filters.distance,
    filters.openNow,
    filters.open24_7,
    filters.emergency,
    filters.sort,
    // Re-run when the set of selected services changes.
    filters.services.join(","),
  ])

  const locateMe = useCallback(async () => {
    setIsLocating(true)
    try {
      const position = await getUserPosition()
      setCenter(position)
      toast.success("Location updated")
    } catch {
      toast.error("Could not access your location", {
        description: "Check your browser permissions and try again.",
      })
    } finally {
      setIsLocating(false)
    }
  }, [])

  return { center, clinics, total, isLoading, error, locateMe, isLocating }
}
