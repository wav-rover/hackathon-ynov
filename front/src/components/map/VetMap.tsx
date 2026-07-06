import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps"
import { Map as MapIcon } from "lucide-react"
import { useEffect } from "react"

import type { VeterinaryClinic } from "@/api/clinics"

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const mapStyles: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
]

type MapCenter = {
  lat: number
  lng: number
}

type VetMapProps = {
  center: MapCenter
  clinics: VeterinaryClinic[]
  selectedId?: string | null
  onSelectClinic?: (id: string) => void
}

function MapViewport({ center }: { center: MapCenter }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return
    map.panTo(center)
  }, [map, center.lat, center.lng])

  return null
}

function getUserLocationIcon(): google.maps.Symbol | undefined {
  if (typeof google === "undefined") return undefined

  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 9,
    fillColor: "#2563eb",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 3,
  }
}

function UserLocationMarker({ position }: { position: MapCenter }) {
  return (
    <Marker
      position={position}
      title="Your location"
      zIndex={1000}
      icon={getUserLocationIcon()}
    />
  )
}

type ClinicMarkerProps = {
  clinic: VeterinaryClinic & { location: { lat: number; lng: number } }
  isSelected: boolean
  isDimmed: boolean
  onSelect?: (id: string) => void
}

function ClinicMarker({
  clinic,
  isSelected,
  isDimmed,
  onSelect,
}: ClinicMarkerProps) {
  return (
    <Marker
      position={clinic.location}
      title={clinic.name ?? "Veterinary clinic"}
      zIndex={isSelected ? 100 : 1}
      opacity={isDimmed ? 0.4 : 1}
      onClick={() => onSelect?.(clinic.id)}
    />
  )
}

function MapPlaceholder({ message }: { message: string }) {
  return (
    <div className="relative size-full min-h-[220px] bg-muted">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
        <MapIcon className="size-8" aria-hidden />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

export function VetMap({
  center,
  clinics,
  selectedId,
  onSelectClinic,
}: VetMapProps) {
  if (!apiKey) {
    return (
      <MapPlaceholder message="Google Maps API key is missing (VITE_GOOGLE_MAPS_API_KEY)." />
    )
  }

  const markers = clinics.filter(
    (clinic): clinic is VeterinaryClinic & {
      location: { lat: number; lng: number }
    } => clinic.location !== null
  )

  return (
    <APIProvider apiKey={apiKey} language="fr">
      <Map
        defaultCenter={center}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={false}
        styles={mapStyles}
        className="size-full min-h-[220px]"
        mapTypeControl={false}
        fullscreenControl={false}
      >
        <MapViewport center={center} />
        <UserLocationMarker position={center} />

        {markers.map((clinic) => (
          <ClinicMarker
            key={clinic.id}
            clinic={clinic}
            isSelected={selectedId === clinic.id}
            isDimmed={Boolean(selectedId && selectedId !== clinic.id)}
            onSelect={onSelectClinic}
          />
        ))}
      </Map>
    </APIProvider>
  )
}
