import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <span
        className="flex size-7 items-center justify-center rounded-sm bg-primary text-[10px] font-bold tracking-tight text-primary-foreground"
        aria-hidden
      >
        RC
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-sm font-semibold tracking-wide text-foreground">
          ROYAL CANIN
        </span>
        <span className="text-[9px] font-medium tracking-[0.18em] text-muted-foreground">
          VET LOCATOR
        </span>
      </span>
    </span>
  )
}
