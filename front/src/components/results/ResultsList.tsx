import { FilterBar } from "@/components/filter/FilterBar"
import { VetResultItem, type VetResult } from "@/components/results/VetResultItem"

const sampleResults: VetResult[] = [
  {
    name: "City Veterinary Centre",
    address: "42 Baker Street, Marylebone, W1U 6TY",
    distance: "280 m",
    isOpenNow: true,
    hours: "Open 24/7",
    openSunday: true,
    isEmergency: true,
    phone: "+442071234567",
    website: "https://example.com",
    directionsUrl: "https://maps.google.com",
  },
  {
    name: "Marylebone Animal Hospital",
    address: "17 Devonshire Street, W1G 7AF",
    distance: "650 m",
    isOpenNow: true,
    hours: "Mon–Sat · 8:00–20:00",
    phone: "+442079876543",
    website: "https://example.com",
    directionsUrl: "https://maps.google.com",
  },
]

function formatResultsCount(count: number) {
  if (count === 0) return "No veterinarians found"
  if (count === 1) return "1 veterinarian found"
  return `${count} veterinarians found`
}

export function ResultsList() {
  const resultsCount = sampleResults.length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-1 border-b border-border px-3 py-3 lg:px-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium">Results</h2>
          <FilterBar />
        </div>
        <p className="text-xs text-muted-foreground">
          {formatResultsCount(resultsCount)}
        </p>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 lg:px-4 lg:py-4">
        {sampleResults.map((vet) => (
          <li key={vet.name}>
            <VetResultItem vet={vet} />
          </li>
        ))}
      </ul>
    </div>
  )
}
