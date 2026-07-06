import { SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const filterOptions = ["Ouvert", "Urgences", "Chiens", "Chats"]

export function FilterBar() {
  return (
    <div className="shrink-0 border-b border-border px-3 py-3 lg:px-4">
      <div className="mb-2 flex items-center gap-2">
        <SlidersHorizontal
          className="size-4 text-muted-foreground"
          aria-hidden
        />
        <span className="text-sm font-medium">Filtres</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "rounded-md border border-input bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
