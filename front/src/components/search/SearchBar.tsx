import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

export function SearchBar() {
  return (
    <div className="shrink-0 border-b border-border px-3 py-3 lg:px-4">
      <label htmlFor="vet-search" className="sr-only">
        Rechercher un vétérinaire
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="vet-search"
          type="search"
          placeholder="Rechercher un vétérinaire..."
          className={cn(
            "h-9 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm outline-none",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          )}
        />
      </div>
    </div>
  )
}
