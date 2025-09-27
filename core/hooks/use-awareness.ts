"use client"

import { useState, useEffect } from "react"
import { container } from "@/core/di/container"
import type { AwarenessYear, Awareness } from "@/core/domain/models/awareness"

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    pagesCount: number
    pageSize: number
    itemsCount: number
  }
}

export function useAwarenessYears(search = "", page = 1, pageSize = 10) {
  const [data, setData] = useState<PaginatedResponse<AwarenessYear> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Calling API: /awarenessYears?search=${search}&page=${page}&pageSize=${pageSize}`)
        const result = await container.services.awareness.getAllAwarenessYears(search, page, pageSize)
        console.log("API Response:", result)
        setData(result)
      } catch (err) {
        console.error("API Error:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch awareness years"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, page, pageSize])

  return { data, loading, error }
}

export function useAwarenessByYearId(yearId: string, search = "", page = 1, pageSize = 10) {
  const [data, setData] = useState<PaginatedResponse<Awareness> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!yearId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Calling API: /awareness/byYear/${yearId}?search=${search}&page=${page}&pageSize=${pageSize}`)
        const result = await container.services.awareness.getAwarenessByYearId(yearId, search, page, pageSize)
        console.log("API Response:", result)
        setData(result)
      } catch (err) {
        console.error("API Error:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch awareness data"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [yearId, search, page, pageSize])

  return { data, loading, error }
}

export function useAwarenessById(id: string) {
  const [data, setData] = useState<Awareness | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Calling API: /awareness/${id}`)
        const result = await container.services.awareness.getAwarenessById(id)
        console.log("API Response:", result)
        setData(result)
      } catch (err) {
        console.error("API Error:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch awareness"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { data, loading, error }
}

export function useCurrentYearAwareness(search = "", page = 1, pageSize = 10) {
  const [data, setData] = useState<PaginatedResponse<Awareness> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Calling API: /awareness/currentYear?search=${search}&page=${page}&pageSize=${pageSize}`)
        const result = await container.services.awareness.getCurrentYearAwareness(search, page, pageSize)
        console.log("API Response:", result)
        setData(result)
      } catch (err) {
        console.error("API Error:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch current year awareness"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, page, pageSize])

  return { data, loading, error }
}
