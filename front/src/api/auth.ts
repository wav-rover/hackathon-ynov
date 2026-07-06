import { apiRequest } from "@/api/client"
import type { components } from "@/api/schema"

export type AuthCredentials = components["schemas"]["AuthCredentials"]
export type AuthResponse = components["schemas"]["AuthResponse"]
export type User = components["schemas"]["User"]

export function register(credentials: AuthCredentials) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: credentials,
  })
}

export function login(credentials: AuthCredentials) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  })
}

export function getCurrentUser(token: string) {
  return apiRequest<User>("/auth/me", { token })
}
