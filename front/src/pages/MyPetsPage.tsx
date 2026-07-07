import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { PawPrint, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { createPet, deletePet, listPets, type Pet } from "@/api/pets"
import { ApiError } from "@/api/client"
import { useBrand } from "@/components/brand/BrandProvider"
import { AppHeader } from "@/components/layout/AppHeader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { clearAuthSession, getAuthToken } from "@/lib/auth-storage"
import { cn } from "@/lib/utils"

export function MyPetsPage() {
  const navigate = useNavigate()
  const { buildPath } = useBrand()
  const token = getAuthToken()

  const [pets, setPets] = useState<Pet[]>([])
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingPetId, setDeletingPetId] = useState<number | null>(null)

  useEffect(() => {
    if (!token) {
      return
    }

    const authToken = token
    let isCancelled = false

    async function loadPets() {
      try {
        const data = await listPets(authToken)
        if (!isCancelled) {
          setPets(data)
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        if (error instanceof ApiError && error.status === 401) {
          clearAuthSession()
          navigate(buildPath("/signin"), { replace: true })
          return
        }

        setErrorMessage("Unable to load your pets. Please try again.")
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadPets()

    return () => {
      isCancelled = true
    }
  }, [buildPath, navigate, token])

  if (!token) {
    return <Navigate to={buildPath("/signin")} replace />
  }

  const authToken = token

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const trimmedName = name.trim()
    const trimmedType = type.trim()

    if (!trimmedName || !trimmedType) {
      setErrorMessage("Name and type are required.")
      return
    }

    setIsSubmitting(true)

    try {
      const pet = await createPet(authToken, {
        name: trimmedName,
        type: trimmedType,
      })

      setPets((currentPets) => [...currentPets, pet])
      setName("")
      setType("")
      toast.success(`${pet.name} has been added.`)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage("Unable to add your pet. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(petId: number) {
    setErrorMessage(null)
    setDeletingPetId(petId)

    try {
      await deletePet(authToken, petId)
      setPets((currentPets) => currentPets.filter((pet) => pet.id !== petId))
      toast.success("Pet removed.")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage("Unable to delete this pet. Please try again.")
    } finally {
      setDeletingPetId(null)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">My pets</CardTitle>
            <CardDescription>Keep track of your companions.</CardDescription>
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
            ) : (
              <>
                {pets.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {pets.map((pet) => (
                      <li
                        key={pet.id}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                            <PawPrint className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{pet.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {pet.type}
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${pet.name}`}
                          disabled={deletingPetId === pet.id}
                          onClick={() => void handleDelete(pet.id)}
                        >
                          {deletingPetId === pet.id ? (
                            <Spinner />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                    <PawPrint className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm font-medium">No pets yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add your first pet below.
                    </p>
                  </div>
                )}

                <form
                  className="flex flex-col gap-4 border-t border-border pt-6"
                  onSubmit={handleSubmit}
                >
                  <p className="text-sm font-medium">Add a pet</p>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pet-name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="pet-name"
                      name="name"
                      type="text"
                      placeholder="Barsik"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pet-type" className="text-sm font-medium">
                      Type
                    </label>
                    <Input
                      id="pet-type"
                      name="type"
                      type="text"
                      placeholder="cat"
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Adding pet...
                      </>
                    ) : (
                      "Add pet"
                    )}
                  </Button>
                </form>

                <Link
                  to={buildPath("/account")}
                  className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                >
                  Back to account
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
