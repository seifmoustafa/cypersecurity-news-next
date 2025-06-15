"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type {
  Standard,
  StandardCategory,
  StandardsPaginatedResponse,
  StandardCategoriesPaginatedResponse,
} from "../domain/models/standard"

export function useStandardCategories(page = 1, pageSize = 10) {
  const [data, setData] = useState<StandardCategoriesPaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true)
      const response = await container.services.standards.getAllStandardCategories(page, pageSize, forceRefresh)
      setData(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, pageSize])

  return { data, loading, error, refetch: () => fetchData(true) }
}

export function useStandardCategoryById(id: string) {
  const [category, setCategory] = useState<StandardCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true)
      const data = await container.services.standards.getStandardCategoryById(id, forceRefresh)
      setCategory(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  return { category, loading, error, refetch: () => fetchData(true) }
}

export function useStandardsByCategory(categoryId: string, page = 1, pageSize = 10) {
  const [data, setData] = useState<StandardsPaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true)
      const response = await container.services.standards.getStandardsByCategory(
        categoryId,
        page,
        pageSize,
        forceRefresh,
      )
      setData(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId) {
      fetchData()
    }
  }, [categoryId, page, pageSize])

  return { data, loading, error, refetch: () => fetchData(true) }
}

export function useStandardById(id: string) {
  const [standard, setStandard] = useState<Standard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true)
      const data = await container.services.standards.getStandardById(id, forceRefresh)
      setStandard(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  return { standard, loading, error, refetch: () => fetchData(true) }
}

// Legacy hooks for backward compatibility
export function useStandards() {
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        setLoading(true)
        const data = await container.services.standards.getAllStandards()
        setStandards(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchStandards()
  }, [])

  return { standards, loading, error }
}
