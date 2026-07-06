import { useEffect, useState } from "react"

import { fetchNearbyClinics } from "@/api/clinics"
import type { VeterinaryClinic } from "@/api/clinics"

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

export function useNearbyClinics() {
  const [center, setCenter] = useState<MapCenter>(DEFAULT_CENTER)
  const [clinics, setClinics] = useState<VeterinaryClinic[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      const position = await getUserPosition().catch(() => DEFAULT_CENTER)
      if (cancelled) return

      setCenter(position)

      try {
        const response = await fetchNearbyClinics({
          lat: position.lat,
          lng: position.lng,
          distance: 10,
          pageSize: 50,
          sort: "nearest",
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
  }, [])

  return { center, clinics, total, isLoading, error }
}
