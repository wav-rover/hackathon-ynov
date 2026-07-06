import { AppHeader } from "@/components/layout/AppHeader"
import { VetMap } from "@/components/map/VetMap"
import { ResultsList } from "@/components/results/ResultsList"
import { SearchBar } from "@/components/search/SearchBar"

export function AppLayout() {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <AppHeader />

      <main className="grid min-h-0 flex-1 grid-rows-[minmax(220px,38svh)_1fr] lg:grid-cols-[clamp(280px,32vw,400px)_1fr] lg:grid-rows-1">
        <aside className="row-start-2 flex min-h-0 flex-col overflow-hidden border-t border-border lg:col-start-1 lg:row-start-1 lg:border-t-0 lg:border-r">
          <SearchBar />
          <ResultsList />
        </aside>

        <section className="row-start-1 min-h-0 lg:col-start-2 lg:row-start-1">
          <VetMap />
        </section>
      </main>
    </div>
  )
}
