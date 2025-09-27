"use client"

import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { ApiPresentation, PresentationsPaginatedResponse } from "@/core/domain/models/media"

interface UsePresentationsByCategoryReturn {
  presentations: ApiPresentation[]
  loading: boolean
  error: string | null
  pagination: PresentationsPaginatedResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function usePresentationsByCategory(
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UsePresentationsByCategoryReturn {
  const [presentations, setPresentations] = useState<ApiPresentation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PresentationsPaginatedResponse["pagination"] | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setPresentations([])
      setPagination(null)
      setLoading(false)
      return
    }

    const fetchPresentations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.media.getPresentationsByCategory(categoryId, page, pageSize, search)
        setPresentations(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setPresentations([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPresentations()
  }, [categoryId, page, pageSize, search])

  const refetch = useCallback(async () => {
    if (!categoryId) return

    try {
      setLoading(true)
      setError(null)
      const response = await container.services.media.getPresentationsByCategory(categoryId, page, pageSize, search)
      setPresentations(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setPresentations([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [categoryId, page, pageSize, search])

  return { presentations, loading, error, pagination, refetch }
}
