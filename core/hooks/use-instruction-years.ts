"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { InstructionYear, InstructionYearsResponse } from "../domain/models/instruction-year"

export function useInstructionYearsByCategory(categoryId: string | null, page = 1, pageSize = 50) {
  const [years, setYears] = useState<InstructionYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState<InstructionYearsResponse["pagination"] | null>(null)

  const fetchYears = async () => {
    if (!categoryId) {
      setYears([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await container.services.instructionYears.getYearsByCategory(categoryId, page, pageSize)

      // Extract data from the response
      if (response && response.data && Array.isArray(response.data)) {
        setYears(response.data)
        setPagination(response.pagination)
      } else {
        console.error("API returned invalid response structure:", response)
        setYears([])
        setError(new Error("Invalid data format received from API"))
      }
    } catch (err) {
      console.error(`Error fetching instruction years for category ${categoryId}:`, err)
      setYears([])
      setError(err instanceof Error ? err : new Error(`Failed to fetch instruction years for category ${categoryId}`))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchYears()
  }, [categoryId, page, pageSize])

  return { years, loading, error, pagination, refetch: fetchYears }
}

export function useInstructionYear(id: string | null) {
  const [year, setYear] = useState<InstructionYear | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchYear = async () => {
      if (!id) {
        setYear(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await container.services.instructionYears.getYearById(id)
        setYear(data)
      } catch (err) {
        console.error(`Error fetching instruction year with id ${id}:`, err)
        setError(err instanceof Error ? err : new Error(`Failed to fetch instruction year with id ${id}`))
      } finally {
        setLoading(false)
      }
    }

    fetchYear()
  }, [id])

  return { year, loading, error }
}

export function useInstructionYearByCategoryAndYear(categoryId: string | null, year: number | null) {
  const [yearData, setYearData] = useState<InstructionYear | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchYear = async () => {
      if (!categoryId || !year) {
        setYearData(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await container.services.instructionYears.getYearByCategoryAndYear(categoryId, year)
        setYearData(data)
      } catch (err) {
        console.error(`Error fetching instruction year ${year} for category ${categoryId}:`, err)
        setError(
          err instanceof Error ? err : new Error(`Failed to fetch instruction year ${year} for category ${categoryId}`),
        )
      } finally {
        setLoading(false)
      }
    }

    fetchYear()
  }, [categoryId, year])

  return { year: yearData, loading, error }
}
