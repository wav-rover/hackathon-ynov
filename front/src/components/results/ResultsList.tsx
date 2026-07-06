import { VetResultItem, type VetResult } from "@/components/results/VetResultItem"

const sampleResults: VetResult[] = [
  {
    name: "Clinique Vétérinaire du Parc",
    address: "12 rue des Lilas, 69003 Lyon",
    distance: "1,2 km",
    status: "Ouvert",
  },
]

function formatResultsCount(count: number) {
  if (count === 0) return "Aucun vétérinaire trouvé"
  if (count === 1) return "1 vétérinaire trouvé"
  return `${count} vétérinaires trouvés`
}

export function ResultsList() {
  const resultsCount = sampleResults.length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-3 py-3 lg:px-4">
        <h2 className="text-sm font-medium">Résultats</h2>
        <p className="text-xs text-muted-foreground">
          {formatResultsCount(resultsCount)}
        </p>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3 lg:px-4 lg:py-4">
        {sampleResults.map((vet) => (
          <li key={vet.name}>
            <VetResultItem vet={vet} />
          </li>
        ))}
      </ul>
    </div>
  )
}
