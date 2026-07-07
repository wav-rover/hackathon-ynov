/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { useLocation } from "react-router-dom"

import {
  getBrandStyle,
  getDirectusAssetUrl,
  type BrandStyle,
} from "@/api/brand-styles"
import { buildBrandPath, getBrandSlugFromPath } from "@/lib/brand-routing"

const BRAND_REFRESH_INTERVAL_MS = 10_000
const DEFAULT_FAVICON_HREF = "/vite.svg"

const DEFAULT_BRAND_STYLE: BrandStyle = {
  slug: "default",
  name: "ROYAL CANIN",
  logo_initials: "RC",
  logo: null,
  favicon: null,
  tagline: "VET LOCATOR",
  font_sans: "'Inter Variable', sans-serif",
  font_heading: "'Inter Variable', sans-serif",
  primary_color: "#C80F2E",
  primary_foreground: "oklch(0.971 0.013 17.38)",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  secondary: "oklch(0.967 0.001 286.375)",
  secondary_foreground: "oklch(0.21 0.006 285.885)",
  muted: "oklch(0.97 0 0)",
  muted_foreground: "oklch(0.556 0 0)",
  accent: "oklch(0.97 0 0)",
  accent_foreground: "oklch(0.205 0 0)",
  border_color: "oklch(0.922 0 0)",
  input_color: "oklch(0.922 0 0)",
  ring: "oklch(0.708 0 0)",
  sidebar_primary: "#C80F2E",
  map_user_marker_fill: "#2563eb",
  map_user_marker_stroke: "#ffffff",
}

const CSS_VARIABLES: Array<[keyof BrandStyle, string]> = [
  ["font_sans", "--font-sans"],
  ["font_heading", "--font-heading"],
  ["primary_color", "--primary"],
  ["primary_foreground", "--primary-foreground"],
  ["background", "--background"],
  ["foreground", "--foreground"],
  ["secondary", "--secondary"],
  ["secondary_foreground", "--secondary-foreground"],
  ["muted", "--muted"],
  ["muted_foreground", "--muted-foreground"],
  ["accent", "--accent"],
  ["accent_foreground", "--accent-foreground"],
  ["border_color", "--border"],
  ["input_color", "--input"],
  ["ring", "--ring"],
  ["sidebar_primary", "--sidebar-primary"],
]

type BrandProviderValue = {
  brandSlug: string
  brandStyle: BrandStyle
  isLoading: boolean
  error: Error | null
  buildPath: (path: string) => string
  refreshBrandStyle: () => Promise<void>
}

const BrandContext = React.createContext<BrandProviderValue | undefined>(
  undefined
)

function mergeBrandStyle(brandStyle: BrandStyle | null) {
  return {
    ...DEFAULT_BRAND_STYLE,
    ...brandStyle,
  }
}

function applyBrandStyle(brandStyle: BrandStyle) {
  const root = document.documentElement

  for (const [key, cssVariable] of CSS_VARIABLES) {
    const value = brandStyle[key]

    if (typeof value === "string" && value.trim() !== "") {
      root.style.setProperty(cssVariable, value)
    }
  }

  root.dataset.brand = brandStyle.slug
}

function applyFavicon(brandStyle: BrandStyle) {
  const cmsFaviconHref = getDirectusAssetUrl(brandStyle.favicon)
  const href = cmsFaviconHref ?? DEFAULT_FAVICON_HREF
  let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']")

  if (!favicon) {
    favicon = document.createElement("link")
    favicon.rel = "icon"
    document.head.appendChild(favicon)
  }

  favicon.href = href

  if (cmsFaviconHref) {
    favicon.removeAttribute("type")
    return
  }

  favicon.type = "image/svg+xml"
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const brandSlug = getBrandSlugFromPath(location.pathname)
  const [brandStyle, setBrandStyle] = React.useState(DEFAULT_BRAND_STYLE)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  const refreshBrandStyle = React.useCallback(
    async (signal?: AbortSignal) => {
      try {
        const nextBrandStyle = await getBrandStyle(brandSlug, signal)
        setBrandStyle(mergeBrandStyle(nextBrandStyle))
        setError(null)
      } catch (nextError) {
        if (signal?.aborted) {
          return
        }

        setBrandStyle(DEFAULT_BRAND_STYLE)
        setError(
          nextError instanceof Error
            ? nextError
            : new Error("Unable to load brand style.")
        )
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [brandSlug]
  )

  React.useEffect(() => {
    const abortController = new AbortController()
    const refreshTimeoutId = window.setTimeout(() => {
      void refreshBrandStyle(abortController.signal)
    }, 0)

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refreshBrandStyle()
      }
    }, BRAND_REFRESH_INTERVAL_MS)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshBrandStyle()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      abortController.abort()
      window.clearTimeout(refreshTimeoutId)
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [refreshBrandStyle])

  React.useEffect(() => {
    applyBrandStyle(brandStyle)
    applyFavicon(brandStyle)
  }, [brandStyle])

  const buildPath = React.useCallback(
    (path: string) => buildBrandPath(brandSlug, path),
    [brandSlug]
  )

  const value = React.useMemo(
    () => ({
      brandSlug,
      brandStyle,
      isLoading,
      error,
      buildPath,
      refreshBrandStyle: () => refreshBrandStyle(),
    }),
    [brandSlug, brandStyle, buildPath, error, isLoading, refreshBrandStyle]
  )

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export function useBrand() {
  const context = React.useContext(BrandContext)

  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider")
  }

  return context
}
