import {
  AlertTriangle,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type VetResult = {
  name: string
  address: string
  distance: string
  isOpenNow: boolean
  hours: string
  openSunday?: boolean
  isEmergency?: boolean
  phone?: string
  website?: string
  directionsUrl?: string
}

type VetResultItemProps = {
  vet: VetResult
}

function ActionButton({
  icon: Icon,
  label,
  href,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href?: string
  disabled?: boolean
}) {
  const className = cn(
    "flex flex-1 flex-col items-center justify-center gap-1 rounded-md border border-border bg-card px-2 py-2.5 text-[11px] font-medium text-primary transition-colors",
    disabled
      ? "pointer-events-none opacity-40"
      : "hover:bg-muted/50 active:bg-muted"
  )

  if (!href || disabled) {
    return (
      <span className={className} aria-disabled={disabled}>
        <Icon className="size-3.5" aria-hidden />
        {label}
      </span>
    )
  }

  const isExternal = href.startsWith("http")

  return (
    <a
      href={href}
      className={className}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </a>
  )
}

export function VetResultItem({ vet }: VetResultItemProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      {vet.isEmergency ? (
        <div className="flex items-center gap-1.5 bg-primary px-3 py-1.5 text-[10px] font-semibold tracking-wide text-primary-foreground uppercase">
          <AlertTriangle className="size-3 shrink-0" aria-hidden />
          24/7 emergency services available
        </div>
      ) : null}

      <div className="space-y-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
            {vet.name}
          </h3>
          <span className="shrink-0 text-sm font-bold text-primary">
            {vet.distance}
          </span>
        </div>

        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden />
          {vet.address}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                vet.isOpenNow ? "bg-emerald-500" : "bg-muted-foreground"
              )}
              aria-hidden
            />
            <span
              className={cn(
                "font-medium",
                vet.isOpenNow ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {vet.isOpenNow ? "Open now" : "Closed"}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3 shrink-0" aria-hidden />
            {vet.hours}
          </span>

          {vet.openSunday ? (
            <span className="font-medium text-primary">Open Sunday</span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-border px-3 py-2.5">
        <ActionButton
          icon={Navigation}
          label="Directions"
          href={vet.directionsUrl}
          disabled={!vet.directionsUrl}
        />
        <ActionButton
          icon={Phone}
          label="Call"
          href={vet.phone ? `tel:${vet.phone}` : undefined}
          disabled={!vet.phone}
        />
        <ActionButton
          icon={ExternalLink}
          label="Website"
          href={vet.website}
          disabled={!vet.website}
        />
      </div>
    </article>
  )
}
