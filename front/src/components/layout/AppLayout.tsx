import { VetMap } from "@/components/map/VetMap"
import { ResultsList } from "@/components/results/ResultsList"

const menuItems = ["Accueil", "Recherche", "À propos"]

export function AppLayout() {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-b border-border">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
          <span className="shrink-0 text-sm font-medium">Vet Locator</span>
          <nav aria-label="Menu principal" className="overflow-x-auto">
            <ul className="flex items-center gap-4 sm:gap-6">
              {menuItems.map((item) => (
                <li key={item} className="shrink-0">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-rows-[minmax(220px,38svh)_1fr] lg:grid-cols-[clamp(280px,32vw,400px)_1fr] lg:grid-rows-1">
        <aside className="row-start-2 min-h-0 overflow-hidden border-t border-border lg:col-start-1 lg:row-start-1 lg:border-t-0 lg:border-r">
          <ResultsList />
        </aside>

        <section className="row-start-1 min-h-0 lg:col-start-2 lg:row-start-1">
          <VetMap />
        </section>
      </main>
    </div>
  )
}
