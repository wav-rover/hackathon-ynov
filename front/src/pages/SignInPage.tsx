import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { login } from "@/api/auth"
import { ApiError } from "@/api/client"
import { AppHeader } from "@/components/layout/AppHeader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getAuthToken, setAuthSession } from "@/lib/auth-storage"

export function SignInPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (getAuthToken()) {
    return <Navigate to="/account" replace />
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const trimmedUsername = username.trim()

    if (!trimmedUsername || !password) {
      setErrorMessage("Username and password are required.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await login({
        username: trimmedUsername,
        password,
      })

      setAuthSession(response.token, response.user)
      toast.success(`Welcome back, ${response.user.username}!`)
      navigate("/account")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage("Unable to sign in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>Access your account to manage your pets and favorites.</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {errorMessage ? (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
