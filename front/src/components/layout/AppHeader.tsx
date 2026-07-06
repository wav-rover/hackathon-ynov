"use client"

import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Crosshair, Menu } from "lucide-react"

import { Logo } from "@/components/logo/Logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { getAuthToken } from "@/lib/auth-storage"

const navLinkClass =
  "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"

function getNavLinkClass(isActive: boolean) {
  return cn(navLinkClass, isActive && "bg-muted text-foreground")
}

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAuthenticated = Boolean(getAuthToken())
  const accountLabel = isAuthenticated ? "Account" : "Sign up"
  const accountHref = isAuthenticated ? "/account" : "/signup"

  return (
    <header className="shrink-0 border-b border-border bg-background">
      <div className="flex h-14 items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-6">
        <Link to="/" className="min-w-0 shrink">
          <Logo className="max-sm:[&_span:last-child]:hidden" />
        </Link>

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

          <nav aria-label="Main navigation" className="flex items-center gap-3">
            <NavLink to="/" className={({ isActive }) => getNavLinkClass(isActive)}>
              Find a Vet
            </NavLink>
            {!isAuthenticated ? (
              <NavLink to="/signin" className={({ isActive }) => getNavLinkClass(isActive)}>
                Sign in
              </NavLink>
            ) : (
              <NavLink to="/my-pets" className={({ isActive }) => getNavLinkClass(isActive)}>
                My Pets
              </NavLink>
            )}
            <NavLink to={accountHref} className={({ isActive }) => getNavLinkClass(isActive)}>
              {accountLabel}
            </NavLink>
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

            <nav aria-label="Main navigation" className="mt-2 flex flex-col gap-1 border-t border-border pt-4">
              <NavLink
                to="/"
                className={({ isActive }) => cn(getNavLinkClass(isActive), "px-2 py-2.5")}
                onClick={() => setIsMenuOpen(false)}
              >
                Find a Vet
              </NavLink>
              {!isAuthenticated ? (
                <NavLink
                  to="/signin"
                  className={({ isActive }) => cn(getNavLinkClass(isActive), "px-2 py-2.5")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </NavLink>
              ) : (
                <NavLink
                  to="/my-pets"
                  className={({ isActive }) => cn(getNavLinkClass(isActive), "px-2 py-2.5")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Pets
                </NavLink>
              )}
              <NavLink
                to={accountHref}
                className={({ isActive }) => cn(getNavLinkClass(isActive), "px-2 py-2.5")}
                onClick={() => setIsMenuOpen(false)}
              >
                {accountLabel}
              </NavLink>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
