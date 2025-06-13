"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { InstructionCategory, InstructionCategoriesResponse } from "../domain/models/instruction-category"

export function useInstructionCategories(page = 1, pageSize = 50) {
  const [categories, setCategories] = useState<InstructionCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState<InstructionCategoriesResponse["pagination"] | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.instructionCategories.getAllCategories(page, pageSize)

      // Extract data from the response
      if (response && response.data && Array.isArray(response.data)) {
        setCategories(response.data)
        setPagination(response.pagination)
      } else {
        console.error("API returned invalid response structure:", response)
        setCategories([])
        setError(new Error("Invalid data format received from API"))
      }
    } catch (err) {
      console.error("Error fetching instruction categories:", err)
      setCategories([])
      setError(err instanceof Error ? err : new Error("Failed to fetch instruction categories"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [page, pageSize])

  return { categories, loading, error, pagination, refetch: fetchCategories }
}

export function useInstructionCategory(id: string | null) {
  const [category, setCategory] = useState<InstructionCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setCategory(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await container.services.instructionCategories.getCategoryById(id)
        setCategory(data)
      } catch (err) {
        console.error(`Error fetching instruction category with id ${id}:`, err)
        setError(err instanceof Error ? err : new Error(`Failed to fetch instruction category with id ${id}`))
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  return { category, loading, error }
}

export function useInstructionCategoryBySlug(slug: string | null) {
  const [category, setCategory] = useState<InstructionCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) {
        setCategory(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await container.services.instructionCategories.getCategoryBySlug(slug)
        setCategory(data)
      } catch (err) {
        console.error(`Error fetching instruction category with slug ${slug}:`, err)
        setError(err instanceof Error ? err : new Error(`Failed to fetch instruction category with slug ${slug}`))
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [slug])

  return { category, loading, error }
}
