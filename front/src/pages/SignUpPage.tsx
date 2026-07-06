import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { register } from "@/api/auth"
import { ApiError } from "@/api/client"
import { AppHeader } from "@/components/layout/AppHeader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { setAuthSession } from "@/lib/auth-storage"

export function SignUpPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const trimmedUsername = username.trim()

    if (!trimmedUsername || !password) {
      setErrorMessage("Username and password are required.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await register({
        username: trimmedUsername,
        password,
      })

      setAuthSession(response.token, response.user)
      toast.success(`Welcome, ${response.user.username}!`)
      navigate("/")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage("Unable to create your account. Please try again.")
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
            <CardTitle className="text-lg">Create an account</CardTitle>
            <CardDescription>Sign up to save your pets and favorite vets.</CardDescription>
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm password
                </label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
