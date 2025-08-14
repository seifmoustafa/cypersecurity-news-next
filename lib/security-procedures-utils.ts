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

// Generate navigation URLs with slugs
export function generateSecurityProcedureUrls(
  standard?: { id: string; nameEn?: string; name?: string } | null,
  control?: { id: string; nameEn?: string; name?: string } | null,
  safeguard?: { id: string; nameEn?: string; name?: string } | null,
  technique?: { id: string; nameEn?: string; name?: string } | null,
  implementation?: { id: string; nameEn?: string; name?: string } | null,
) {
  const base = "/security-procedures"

  if (!standard) return { base }

  const standardName = standard.nameEn || standard.name || ""
  const standardSlug = createSecurityProcedureSlug(standardName, standard.id)
  const standardUrl = `${base}/${standardSlug}`

  if (!control) return { base, standardUrl }

  const controlName = control.nameEn || control.name || ""
  const controlSlug = createSecurityProcedureSlug(controlName, control.id)
  const controlUrl = `${standardUrl}/${controlSlug}`

  if (!safeguard) return { base, standardUrl, controlUrl }

  const safeguardName = safeguard.nameEn || safeguard.name || ""
  const safeguardSlug = createSecurityProcedureSlug(safeguardName, safeguard.id)
  const safeguardUrl = `${controlUrl}/${safeguardSlug}`

  if (!technique) return { base, standardUrl, controlUrl, safeguardUrl }

  const techniqueName = technique.nameEn || technique.name || ""
  const techniqueSlug = createSecurityProcedureSlug(techniqueName, technique.id)
  const techniqueUrl = `${safeguardUrl}/${techniqueSlug}`

  if (!implementation) return { base, standardUrl, controlUrl, safeguardUrl, techniqueUrl }

  const implementationName = implementation.nameEn || implementation.name || ""
  const implementationSlug = createSecurityProcedureSlug(implementationName, implementation.id)
  const implementationUrl = `${techniqueUrl}/${implementationSlug}`

  return { base, standardUrl, controlUrl, safeguardUrl, techniqueUrl, implementationUrl }
}
