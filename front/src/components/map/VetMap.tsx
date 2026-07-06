import { Map } from "lucide-react"

export function VetMap() {
  return (
    <div className="relative size-full min-h-[220px] bg-muted">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <Map className="size-8" aria-hidden />
        <span className="text-sm">Carte</span>
      </div>
    </div>
  )
}
