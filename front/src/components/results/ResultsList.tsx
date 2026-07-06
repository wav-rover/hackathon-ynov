export function ResultsList() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-4 py-3 lg:px-6">
        <h2 className="text-sm font-medium">Résultats</h2>
        <p className="text-xs text-muted-foreground">0 vétérinaire trouvé</p>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-4 py-3 lg:px-6">
        <li className="py-8 text-center text-sm text-muted-foreground">
          Aucun résultat pour le moment
        </li>
      </ul>
    </div>
  )
}
