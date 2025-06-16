"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { Control, ControlsPaginatedResponse } from "../domain/models/standard"

interface UseControlsResult {
  controls: Control[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useControls(standardId: string, page = 1, pageSize = 10, forceRefresh = false): UseControlsResult {
  const [controls, setControls] = useState<Control[]>([])
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: pageSize,
    currentPage: page,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchControls = async () => {
    if (!standardId) return

    try {
      setLoading(true)
      setError(null)

      const standardsService = container.standardsService
      if (!standardsService) {
        throw new Error("Standards service not available")
      }

      const response: ControlsPaginatedResponse = await standardsService.getControlsByStandardId(
        standardId,
        page,
        pageSize,
        forceRefresh,
      )

      setControls(response.data || [])
      setPagination(
        response.pagination || {
          itemsCount: 0,
          pagesCount: 0,
          pageSize: pageSize,
          currentPage: page,
        },
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch controls"
      setError(errorMessage)
      console.error("Error fetching controls:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchControls()
  }, [standardId, page, pageSize, forceRefresh])

  const refetch = () => {
    fetchControls()
  }

  return {
    controls,
    pagination,
    loading,
    error,
    refetch,
  }
}

export function useControl(controlId: string, forceRefresh = false) {
  const [control, setControl] = useState<Control | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchControl = async () => {
    if (!controlId) return

    try {
      setLoading(true)
      setError(null)

      const standardsService = container.standardsService
      if (!standardsService) {
        throw new Error("Standards service not available")
      }

      const response = await standardsService.getControlById(controlId, forceRefresh)
      setControl(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch control"
      setError(errorMessage)
      console.error("Error fetching control:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchControl()
  }, [controlId, forceRefresh])

  const refetch = () => {
    fetchControl()
  }

  return {
    control,
    loading,
    error,
    refetch,
  }
}
