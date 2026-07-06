import { apiRequest } from "@/api/client"
import type { components } from "@/api/schema"

export type Pet = components["schemas"]["Pet"]
export type CreatePetRequest = components["schemas"]["CreatePetRequest"]

export function listPets(token: string) {
  return apiRequest<Pet[]>("/pets", { token })
}

export function createPet(token: string, data: CreatePetRequest) {
  return apiRequest<Pet>("/pets", {
    method: "POST",
    body: data,
    token,
  })
}

export function deletePet(token: string, id: number) {
  return apiRequest<Pet>(`/pets/${id}`, {
    method: "DELETE",
    token,
  })
}
