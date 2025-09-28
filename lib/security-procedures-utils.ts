import { slugify } from "./utils"

// Utility functions for security procedures slug handling
export function createSecurityProcedureSlug(name: string, id?: string): string {
  if (!name) return id || ""
  return slugify(name, id)
}

// Function to find entity by slug from a list
export function findEntityBySlug<T extends { id: string; nameEn?: string; name?: string }>(
  entities: T[],
  slug: string,
): T | null {
  if (!entities || entities.length === 0 || !slug) return null

  return (
    entities.find((entity) => {
      const entityName = entity.nameEn || entity.name || ""
      return createSecurityProcedureSlug(entityName, entity.id) === slug
    }) || null
  )
}

// Function to find entity by slug with fallback to ID
export function findEntityBySlugOrId<T extends { id: string; nameEn?: string; name?: string }>(
  entities: T[],
  slugOrId: string,
): T | null {
  if (!entities || entities.length === 0 || !slugOrId) return null

  // First try to find by slug
  const bySlug = findEntityBySlug(entities, slugOrId)
  if (bySlug) return bySlug

  // Fallback to finding by ID
  return entities.find((entity) => entity.id === slugOrId) || null
}

// Generate navigation URLs with IDs
export function generateSecurityProcedureUrls(
  standard?: { id: string; nameEn?: string; name?: string } | null,
  control?: { id: string; nameEn?: string; name?: string } | null,
  safeguard?: { id: string; nameEn?: string; name?: string } | null,
  technique?: { id: string; nameEn?: string; name?: string } | null,
  implementation?: { id: string; nameEn?: string; name?: string } | null,
) {
  const base = "/security-procedures"

  if (!standard) return { base }

  const standardUrl = `${base}/${standard.id}`

  if (!control) return { base, standardUrl }

  const controlUrl = `${standardUrl}/${control.id}`

  if (!safeguard) return { base, standardUrl, controlUrl }

  const safeguardUrl = `${controlUrl}/${safeguard.id}`

  if (!technique) return { base, standardUrl, controlUrl, safeguardUrl }

  const techniqueUrl = `${safeguardUrl}/${technique.id}`

  if (!implementation) return { base, standardUrl, controlUrl, safeguardUrl, techniqueUrl }

  const implementationUrl = `${techniqueUrl}/${implementation.id}`

  return { base, standardUrl, controlUrl, safeguardUrl, techniqueUrl, implementationUrl }
}
