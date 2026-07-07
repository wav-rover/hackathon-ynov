import { getDirectusAssetUrl } from "@/api/brand-styles"
import { useBrand } from "@/components/brand/BrandProvider"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const { brandStyle } = useBrand()
  const initials = brandStyle.logo_initials ?? "RC"
  const name = brandStyle.name ?? "ROYAL CANIN"
  const tagline = brandStyle.tagline ?? "VET LOCATOR"
  const logoUrl = getDirectusAssetUrl(brandStyle.logo)

  return (
    <span className={cn("flex shrink-0 items-center gap-2.5", className)}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="size-7 rounded-sm object-contain"
          aria-hidden
        />
      ) : (
        <span
          className="flex size-7 items-center justify-center rounded-sm bg-primary text-[10px] font-bold tracking-tight text-primary-foreground"
          aria-hidden
        >
          {initials}
        </span>
      )}
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-sm font-semibold tracking-wide text-foreground">
          {name}
        </span>
        <span className="text-[9px] font-medium tracking-[0.18em] text-muted-foreground">
          {tagline}
        </span>
      </span>
    </span>
  )
}
