const BRAND_STYLES_COLLECTION = "brand_styles"

type DirectusListResponse<T> = {
  data: T[]
}

type DirectusFileReference =
  | string
  | {
      id: string
    }

export type BrandStyle = {
  slug: string
  name: string
  logo_initials?: string | null
  logo?: DirectusFileReference | null
  favicon?: DirectusFileReference | null
  tagline?: string | null
  font_sans?: string | null
  font_heading?: string | null
  primary_color?: string | null
  primary_foreground?: string | null
  background?: string | null
  foreground?: string | null
  secondary?: string | null
  secondary_foreground?: string | null
  muted?: string | null
  muted_foreground?: string | null
  accent?: string | null
  accent_foreground?: string | null
  border_color?: string | null
  input_color?: string | null
  ring?: string | null
  sidebar_primary?: string | null
  map_user_marker_fill?: string | null
  map_user_marker_stroke?: string | null
}

function getDirectusBaseUrl() {
  return import.meta.env.VITE_DIRECTUS_URL ?? "http://localhost:8055"
}

function getDirectusFileId(file?: DirectusFileReference | null) {
  if (!file) {
    return null
  }

  if (typeof file === "string") {
    return file
  }

  return file.id
}

export function getDirectusAssetUrl(file?: DirectusFileReference | null) {
  const fileId = getDirectusFileId(file)

  if (!fileId) {
    return null
  }

  return `${getDirectusBaseUrl()}/assets/${encodeURIComponent(fileId)}`
}

async function getBrandBySlug(slug: string, signal?: AbortSignal) {
  const params = new URLSearchParams({
    "filter[slug][_eq]": slug,
    limit: "1",
  })

  const response = await fetch(
    `${getDirectusBaseUrl()}/items/${BRAND_STYLES_COLLECTION}?${params}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(`Unable to load brand style "${slug}".`)
  }

  const body = (await response.json()) as DirectusListResponse<BrandStyle>

  return body.data[0] ?? null
}

export async function getBrandStyle(slug: string, signal?: AbortSignal) {
  const brand = await getBrandBySlug(slug, signal)

  if (brand !== null) {
    return brand
  }

  if (slug === "default") {
    return null
  }

  return getBrandBySlug("default", signal)
}
