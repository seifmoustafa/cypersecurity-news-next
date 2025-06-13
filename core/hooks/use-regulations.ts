"use client"

import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { Regulation } from "../domain/models/regulation"

interface UseRegulationsResult {
  regulations: Regulation[]
  loading: boolean
  error: string | null
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  } | null
  refetch: () => void
}

export function useRegulations(page = 1, pageSize = 10): UseRegulationsResult {
  const [regulations, setRegulations] = useState<Regulation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseRegulationsResult["pagination"]>(null)

  const fetchRegulations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.regulations.getAllRegulations(page, pageSize)
      setRegulations(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error("Error fetching regulations:", error)
      setError("Failed to load regulations. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchRegulations()
  }, [fetchRegulations])

  return { regulations, loading, error, pagination, refetch: fetchRegulations }
}

export function useRegulationsByCategory(categoryId: string, page = 1, pageSize = 10): UseRegulationsResult {
  const [regulations, setRegulations] = useState<Regulation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseRegulationsResult["pagination"]>(null)

  const fetchRegulations = useCallback(async () => {
    if (!categoryId) {
      setRegulations([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await container.services.regulations.getRegulationsByCategory(categoryId, page, pageSize)
      setRegulations(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error(`Error fetching regulations for category ${categoryId}:`, error)
      setError("Failed to load regulations. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [categoryId, page, pageSize])

  useEffect(() => {
    fetchRegulations()
  }, [fetchRegulations])

  return { regulations, loading, error, pagination, refetch: fetchRegulations }
}

export function useRegulation(slug: string) {
  const [regulation, setRegulation] = useState<Regulation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRegulation = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await container.services.regulations.getRegulationBySlug(slug)
      setRegulation(data)
      if (!data) {
        setError("Regulation not found")
      }
    } catch (error) {
      console.error(`Error fetching regulation with slug ${slug}:`, error)
      setError("Failed to load regulation. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchRegulation()
  }, [fetchRegulation])

  return { regulation, loading, error, refetch: fetchRegulation }
}
