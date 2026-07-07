"use client"

import { useState } from "react"
import { ArrowDownUp, ChevronDown, SlidersHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  countActiveFilters,
  DISTANCE_OPTIONS,
  SORT_OPTIONS,
  SPECIALTIES,
  type ClinicFilters,
  type SortValue,
} from "@/lib/filters"

type FilterBarProps = {
  filters: ClinicFilters
  onChange: (filters: ClinicFilters) => void
  onReset: () => void
}

function getSortLabel(value: SortValue) {
  return SORT_OPTIONS.find((option) => option.value === value)?.label ?? "Sort"
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const activeCount = countActiveFilters(filters)

  function patch(part: Partial<ClinicFilters>) {
    onChange({ ...filters, ...part })
  }

  function toggleService(value: string, checked: boolean) {
    const services = checked
      ? [...filters.services, value]
      : filters.services.filter((service) => service !== value)
    patch({ services })
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal data-icon="inline-start" />
          Filters
          {activeCount > 0 ? (
            <Badge className="ml-1 size-4 rounded-full p-0 tabular-nums">
              {activeCount}
            </Badge>
          ) : null}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="outline" size="sm" className="min-w-0" />
            }
          >
            <ArrowDownUp data-icon="inline-start" />
            <span className="truncate">{getSortLabel(filters.sort)}</span>
            <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuRadioGroup
              value={filters.sort}
              onValueChange={(value) => patch({ sort: value as SortValue })}
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-border px-4 py-5">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Refine your veterinarian search.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
            <section className="space-y-1">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Availability
              </h3>
              <ToggleRow
                id="filter-emergency"
                label="Emergency 24/7"
                description="Clinics offering emergency care"
                checked={filters.emergency}
                onCheckedChange={(emergency) => patch({ emergency })}
              />
              <ToggleRow
                id="filter-open-now"
                label="Open now"
                checked={filters.openNow}
                onCheckedChange={(openNow) => patch({ openNow })}
              />
              <ToggleRow
                id="filter-open-24-7"
                label="Open 24/7"
                checked={filters.open24_7}
                onCheckedChange={(open24_7) => patch({ open24_7 })}
              />
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Distance
              </h3>
              <div className="flex flex-wrap gap-2">
                {DISTANCE_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    size="sm"
                    variant={filters.distance === option ? "default" : "outline"}
                    className={cn(
                      "min-w-16",
                      filters.distance === option &&
                        "bg-black text-white hover:bg-black/90"
                    )}
                    onClick={() => patch({ distance: option })}
                  >
                    {option} km
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Specialist services
              </h3>
              <div className="space-y-3">
                {SPECIALTIES.map((specialty) => {
                  const id = `filter-service-${specialty.value}`
                  const checked = filters.services.includes(specialty.value)

                  return (
                    <div key={specialty.value} className="flex items-center gap-2.5">
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleService(specialty.value, value === true)
                        }
                      />
                      <Label htmlFor={id} className="text-sm font-normal">
                        {specialty.label}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          <SheetFooter className="mt-auto border-t border-border bg-muted/30 px-4 py-4">
            <div className="flex w-full flex-col gap-2">
              <SheetClose
                render={
                  <Button
                    type="button"
                    size="lg"
                    className="w-full bg-black text-white hover:bg-black/90"
                  />
                }
              >
                View results
              </SheetClose>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="w-full text-muted-foreground"
                onClick={onReset}
              >
                Reset
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
