"use client"

import { useState } from "react"
import { ArrowDownUp, ChevronDown, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "distance", label: "Distance" },
  { value: "name", label: "Name (A-Z)" },
] as const

type SortValue = (typeof sortOptions)[number]["value"]

function getSortLabel(value: SortValue) {
  return sortOptions.find((option) => option.value === value)?.label ?? "Sort"
}

export function FilterBar() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sort, setSort] = useState<SortValue>("relevance")

  function resetFilters() {}

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
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="outline" size="sm" className="min-w-0" />
            }
          >
            <ArrowDownUp data-icon="inline-start" />
            <span className="truncate">{getSortLabel(sort)}</span>
            <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => setSort(value as SortValue)}
            >
              {sortOptions.map((option) => (
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

          <div className="flex-1 overflow-y-auto px-4 py-4" />

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
                onClick={resetFilters}
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
