import type { User } from "@/api/auth"

const TOKEN_KEY = "vet-locator.token"
const USER_KEY = "vet-locator.user"

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAuthUser(): User | null {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as User
  } catch {
    return null
  }
}

export function setAuthSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
