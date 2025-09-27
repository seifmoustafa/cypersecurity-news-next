import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { AwarenessResponse } from "@/core/domain/models/awareness"

interface UseCurrentYearAwarenessReturn {
  awareness: AwarenessResponse["data"]
  loading: boolean
  error: string | null
  pagination: AwarenessResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useCurrentYearAwareness(
  search: string = "",
  page: number = 1,
  pageSize: number = 10
): UseCurrentYearAwarenessReturn {
  const [awareness, setAwareness] = useState<AwarenessResponse["data"]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<AwarenessResponse["pagination"] | null>(null)

  const fetchAwareness = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.awareness.getCurrentYearAwareness(search, page, pageSize)
      setAwareness(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setAwareness([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [search, page, pageSize])

  useEffect(() => {
    fetchAwareness()
  }, [fetchAwareness])

  return { awareness, loading, error, pagination, refetch: fetchAwareness }
}
