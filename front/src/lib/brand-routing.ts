const RESERVED_FIRST_SEGMENTS = new Set([
  "account",
  "my-pets",
  "signin",
  "signup",
])

export function getBrandSlugFromPath(pathname: string) {
  const [firstSegment] = pathname.split("/").filter(Boolean)

  if (!firstSegment) {
    return "default"
  }

  if (RESERVED_FIRST_SEGMENTS.has(firstSegment)) {
    return "default"
  }

  return firstSegment
}

export function getBrandRoutePrefix(brandSlug: string) {
  return brandSlug === "default" ? "" : `/${brandSlug}`
}

export function buildBrandPath(brandSlug: string, path: string) {
  const prefix = getBrandRoutePrefix(brandSlug)

  if (path === "/") {
    return prefix || "/"
  }

  return `${prefix}${path}`
}
