import { clinicToVetResult } from "@/api/clinics"
import type { VeterinaryClinic } from "@/api/clinics"
import { FilterBar } from "@/components/filter/FilterBar"
import { VetResultItem } from "@/components/results/VetResultItem"
import { Spinner } from "@/components/ui/spinner"

type ResultsListProps = {
  clinics: VeterinaryClinic[]
  total: number
  isLoading: boolean
  error: string | null
  selectedId?: string | null
  onSelectClinic?: (id: string) => void
}

function formatResultsCount(count: number) {
  if (count === 0) return "No veterinarians found"
  if (count === 1) return "1 veterinarian found"
  return `${count} veterinarians found`
}

export function ResultsList({
  clinics,
  total,
  isLoading,
  error,
  selectedId,
  onSelectClinic,
}: ResultsListProps) {
  const results = clinics.map(clinicToVetResult)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-1 border-b border-border px-3 py-3 lg:px-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium">Results</h2>
          <FilterBar />
        </div>
        <p className="text-xs text-muted-foreground">
          {formatResultsCount(total)}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          Loading nearby clinics...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-destructive">
          {error}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-muted-foreground">
          No clinics found nearby. Try expanding your search radius.
        </div>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 lg:px-4 lg:py-4">
          {results.map((vet) => (
            <li key={vet.id}>
              <VetResultItem
                vet={vet}
                isSelected={selectedId === vet.id}
                onSelect={onSelectClinic}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
