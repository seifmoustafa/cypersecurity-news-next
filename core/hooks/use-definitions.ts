import { useEffect, useState, useCallback } from "react"
import { container } from "@/core/di/container"
import type { Definition, DefinitionsPaginatedResponse } from "../domain/models/definition"

interface UseDefinitionsReturn {
  definitions: Definition[]
  loading: boolean
  error: string | null
  pagination: DefinitionsPaginatedResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useDefinitions(
  categoryId: string | null = null,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseDefinitionsReturn {
  const [definitions, setDefinitions] = useState<Definition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<DefinitionsPaginatedResponse["pagination"] | null>(null)

  const fetchDefinitions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.definitions.getDefinitionsByCategory(categoryId!, page, pageSize, search)
      setDefinitions(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setDefinitions([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [categoryId, page, pageSize, search])

  useEffect(() => {
    if (categoryId) {
      fetchDefinitions()
    }
  }, [fetchDefinitions])

  return { definitions, loading, error, pagination, refetch: fetchDefinitions }
}
