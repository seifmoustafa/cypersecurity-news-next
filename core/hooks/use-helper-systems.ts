"use client"

import { useState, useEffect, useCallback } from "react"
import { container } from "../di/container"
import type { HelperSystem, HelperSystemsResponse } from "../domain/models/helper-system"

interface UseHelperSystemsResult {
  helperSystems: HelperSystem[]
  loading: boolean
  error: string | null
  pagination: HelperSystemsResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useHelperSystems(page = 1, pageSize = 10): UseHelperSystemsResult {
  const [helperSystems, setHelperSystems] = useState<HelperSystem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<HelperSystemsResponse["pagination"] | null>(null)

  const fetchHelperSystems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`🔄 useHelperSystems: Fetching page ${page}, pageSize ${pageSize}`)

      const response = await container.services.helperSystems.getHelperSystems(page, pageSize)

      console.log(`📊 useHelperSystems: Received response`, response)

      setHelperSystems(response.data)
      setPagination(response.pagination)
    } catch (err) {
      console.error("❌ useHelperSystems: Error fetching helper systems:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch helper systems")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchHelperSystems()
  }, [fetchHelperSystems])

  return {
    helperSystems,
    loading,
    error,
    pagination,
    refetch: fetchHelperSystems,
  }
}

interface UseHelperSystemResult {
  helperSystem: HelperSystem | null
  loading: boolean
  error: string | null
}

export function useHelperSystem(id: string): UseHelperSystemResult {
  const [helperSystem, setHelperSystem] = useState<HelperSystem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHelperSystem = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`🔄 useHelperSystem: Fetching helper system with ID: ${id}`)

        const data = await container.services.helperSystems.getHelperSystemById(id)

        console.log(`📊 useHelperSystem: Received data`, data)

        setHelperSystem(data)
      } catch (err) {
        console.error("❌ useHelperSystem: Error fetching helper system:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch helper system")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchHelperSystem()
    }
  }, [id])

  return {
    helperSystem,
    loading,
    error,
  }
}
