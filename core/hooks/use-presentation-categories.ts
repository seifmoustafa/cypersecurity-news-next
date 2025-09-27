import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { PresentationCategory, PresentationCategoriesResponse } from "@/core/domain/models/media"

interface UsePresentationCategoriesReturn {
  categories: PresentationCategory[]
  loading: boolean
  error: string | null
  pagination: PresentationCategoriesResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function usePresentationCategories(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UsePresentationCategoriesReturn {
  const [categories, setCategories] = useState<PresentationCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PresentationCategoriesResponse["pagination"] | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.media.getPresentationCategories(page, pageSize, search)
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
