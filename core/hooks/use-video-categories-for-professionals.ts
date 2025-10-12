import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { VideoCategory, VideoCategoriesResponse } from "@/core/domain/models/media"

interface UseVideoCategoriesForProfessionalsReturn {
  categories: VideoCategory[]
  loading: boolean
  error: string | null
  pagination: VideoCategoriesResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useVideoCategoriesForProfessionals(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseVideoCategoriesForProfessionalsReturn {
  const [categories, setCategories] = useState<VideoCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<VideoCategoriesResponse["pagination"] | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.media.getVideoCategoriesForProfessionals(page, pageSize, search)
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