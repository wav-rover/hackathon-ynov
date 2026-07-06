import { MapPin } from "lucide-react"

export type VetResult = {
  name: string
  address: string
  distance: string
  status: string
}

type VetResultItemProps = {
  vet: VetResult
}

export function VetResultItem({ vet }: VetResultItemProps) {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium">{vet.name}</h3>
        <span className="shrink-0 text-xs text-muted-foreground">
          {vet.distance}
        </span>
      </div>

      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3 shrink-0" aria-hidden />
        {vet.address}
      </p>

      <p className="mt-2 text-xs text-primary">{vet.status}</p>
    </button>
  )
}
