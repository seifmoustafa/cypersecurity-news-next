import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { ApiVideo, VideosPaginatedResponse } from "@/core/domain/models/media"

interface UseVideosByCategoryReturn {
  videos: ApiVideo[]
  loading: boolean
  error: string | null
  pagination: VideosPaginatedResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useVideosByCategory(
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseVideosByCategoryReturn {
  const [videos, setVideos] = useState<ApiVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<VideosPaginatedResponse["pagination"] | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setVideos([])
      setPagination(null)
      setLoading(false)
      return
    }

    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.media.getVideosByCategory(categoryId, page, pageSize, search)
        setVideos(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setVideos([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [categoryId, page, pageSize, search])

  const refetch = useCallback(async () => {
    if (!categoryId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.media.getVideosByCategory(categoryId, page, pageSize, search)
      setVideos(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setVideos([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [categoryId, page, pageSize, search])

  return { videos, loading, error, pagination, refetch }
}
