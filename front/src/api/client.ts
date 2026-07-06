import type { components } from "@/api/schema"

export type ApiErrorBody = components["schemas"]["Error"]

export class ApiError extends Error {
  readonly status: number
  readonly details?: ApiErrorBody["details"]

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.name = "ApiError"
    this.status = status
    this.details = body.details
  }
}

function getBaseUrl() {
  return import.meta.env.VITE_API_URL ?? ""
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  token?: string | null
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options

  const response = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({
      message: "Request failed",
    }))) as ApiErrorBody

    throw new ApiError(response.status, errorBody)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
