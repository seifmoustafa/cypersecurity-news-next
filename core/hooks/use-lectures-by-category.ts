import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { ApiLecture, LecturesPaginatedResponse } from "@/core/domain/models/media"

interface UseLecturesByCategoryReturn {
  lectures: ApiLecture[]
  loading: boolean
  error: string | null
  pagination: LecturesPaginatedResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useLecturesByCategory(
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseLecturesByCategoryReturn {
  const [lectures, setLectures] = useState<ApiLecture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<LecturesPaginatedResponse["pagination"] | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setLectures([])
      setPagination(null)
      setLoading(false)
      return
    }

    const fetchLectures = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.media.getLecturesByCategory(categoryId, page, pageSize, search)
        setLectures(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLectures([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLectures()
  }, [categoryId, page, pageSize, search])

  const refetch = useCallback(async () => {
    if (!categoryId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.media.getLecturesByCategory(categoryId, page, pageSize, search)
      setLectures(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLectures([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [categoryId, page, pageSize, search])

  return { lectures, loading, error, pagination, refetch }
}
