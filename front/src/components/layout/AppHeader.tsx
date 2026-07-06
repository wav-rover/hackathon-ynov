"use client"

import { useState } from "react"
import { Crosshair, Menu } from "lucide-react"

import { Logo } from "@/components/logo/Logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const navLinkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground"

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="shrink-0 border-b border-border bg-background">
      <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-6">
        <a href="/" className="min-w-0 shrink">
          <Logo className="max-sm:[&_span:last-child]:hidden" />
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 sm:gap-4 md:flex">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-9 shrink-0 gap-2 rounded-lg px-3 text-sm"
          >
            <Crosshair className="size-4" aria-hidden />
            Use my location
          </Button>

          <Button type="button" variant="secondary" size="lg" className="h-9 shrink-0 rounded-lg px-4 text-sm">
            Find a Vet
          </Button>

          <nav aria-label="Account navigation" className="flex items-center gap-5">
            <button type="button" className={navLinkClass}>
              My Pets
            </button>
            <button type="button" className={navLinkClass}>
              Account
            </button>
          </nav>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="ml-auto shrink-0 md:hidden"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xs">
          <SheetHeader className="border-b border-border px-4 py-5">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-2 px-4 py-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 w-full justify-start gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Crosshair className="size-4" aria-hidden />
              Use my location
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="h-10 w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Find a Vet
            </Button>

            <nav aria-label="Account navigation" className="mt-2 flex flex-col gap-1 border-t border-border pt-4">
              <button type="button" className={`${navLinkClass} rounded-md px-2 py-2.5 text-left`}>
                My Pets
              </button>
              <button type="button" className={`${navLinkClass} rounded-md px-2 py-2.5 text-left`}>
                Account
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
