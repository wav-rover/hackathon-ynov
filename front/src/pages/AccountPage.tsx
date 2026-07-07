import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

import { getCurrentUser, type User } from "@/api/auth"
import { ApiError } from "@/api/client"
import { useBrand } from "@/components/brand/BrandProvider"
import { AppHeader } from "@/components/layout/AppHeader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
  setAuthSession,
} from "@/lib/auth-storage"
import { cn } from "@/lib/utils"

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase()
}

export function AccountPage() {
  const navigate = useNavigate()
  const { buildPath } = useBrand()
  const token = getAuthToken()

  const [user, setUser] = useState<User | null>(() => getAuthUser())
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      return
    }

    const authToken = token
    let isCancelled = false

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser(authToken)
        if (isCancelled) {
          return
        }

        setUser(currentUser)
        setAuthSession(authToken, currentUser)
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError && error.status === 401) {
          clearAuthSession()
          navigate(buildPath("/signup"), { replace: true })
          return
        }

        setErrorMessage("Unable to load your account. Please try again.")
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadUser()

    return () => {
      isCancelled = true
    }
  }, [buildPath, navigate, token])

  if (!token) {
    return <Navigate to={buildPath("/signup")} replace />
  }

  function handleLogout() {
    clearAuthSession()
    navigate(buildPath("/"))
  }

  const pets = user?.pets ?? []

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">My account</CardTitle>
            <CardDescription>Manage your profile and pets.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {errorMessage ? (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="size-6" />
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-4">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-base font-medium">
                      {user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      User #{user.id}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">My pets</p>
                  {pets.length > 0 ? (
                    <ul className="mt-3 flex flex-col gap-2">
                      {pets.map((pet) => (
                        <li
                          key={pet.id}
                          className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{pet.name}</span>
                          <span className="text-muted-foreground capitalize">
                            {pet.type}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No pets added yet.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Log out
                  </Button>

                  <Link
                    to={buildPath("/")}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full"
                    )}
                  >
                    Back to home
                  </Link>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
