import { useEffect, useState, useCallback } from "react"
import { container } from "@/core/di/container"
import type { DefinitionCategory, DefinitionCategoriesPaginatedResponse } from "../domain/models/definition"

interface UseDefinitionCategoriesReturn {
  categories: DefinitionCategory[]
  loading: boolean
  error: string | null
  pagination: DefinitionCategoriesPaginatedResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useDefinitionCategories(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseDefinitionCategoriesReturn {
  const [categories, setCategories] = useState<DefinitionCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<DefinitionCategoriesPaginatedResponse["pagination"] | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.definitions.getAllCategories(page, pageSize, search)
      setCategories(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setCategories([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, pagination, refetch: fetchCategories }
}
