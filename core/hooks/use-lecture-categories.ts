import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { LectureCategory, LectureCategoriesResponse } from "@/core/domain/models/media"

interface UseLectureCategoriesReturn {
  categories: LectureCategory[]
  loading: boolean
  error: string | null
  pagination: LectureCategoriesResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useLectureCategories(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseLectureCategoriesReturn {
  const [categories, setCategories] = useState<LectureCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<LectureCategoriesResponse["pagination"] | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.media.getLectureCategories(page, pageSize, search)
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
