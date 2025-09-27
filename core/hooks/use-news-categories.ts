import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { NewsCategory, NewsCategoriesResponse } from "@/core/domain/models/news"

interface UseNewsCategoriesReturn {
  categories: NewsCategory[]
  loading: boolean
  error: string | null
  pagination: NewsCategoriesResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useNewsCategories(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseNewsCategoriesReturn {
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<NewsCategoriesResponse["pagination"] | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.news.getNewsCategories(page, pageSize, search)
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
