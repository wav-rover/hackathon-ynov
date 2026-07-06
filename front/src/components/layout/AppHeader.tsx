import { Crosshair } from "lucide-react"

import { Logo } from "@/components/logo/Logo"
import { Button } from "@/components/ui/button"

const navLinkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground"

export function AppHeader() {
  return (
    <header className="shrink-0 border-b border-border bg-background">
      <div className="flex h-16 items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <a href="/" className="shrink-0">
          <Logo />
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-9 shrink-0 gap-2 rounded-lg px-3 text-sm"
          >
            <Crosshair className="size-4" aria-hidden />
            <span className="hidden sm:inline">Use my location</span>
            <span className="sm:hidden">Location</span>
          </Button>

          <Button type="button" variant="secondary" size="lg" className="h-9 shrink-0 rounded-lg px-4 text-sm">
            Find a Vet
          </Button>

          <nav aria-label="Account navigation" className="hidden items-center gap-5 md:flex">
            <button type="button" className={navLinkClass}>
              My Pets
            </button>
            <button type="button" className={navLinkClass}>
              Account
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
