"use client"

import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { RegulationCategory } from "../domain/models/regulation-category"

interface UseRegulationCategoriesResult {
  categories: RegulationCategory[]
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

export function useRegulationCategories(page = 1, pageSize = 10): UseRegulationCategoriesResult {
  const [categories, setCategories] = useState<RegulationCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseRegulationCategoriesResult["pagination"]>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.regulationCategories.getAllCategories(page, pageSize)
      setCategories(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error("Error fetching regulation categories:", error)
      setError("Failed to load regulation categories. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, pagination, refetch: fetchCategories }
}

export function useRegulationCategory(slug?: string) {
  const [category, setCategory] = useState<RegulationCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategory = useCallback(async () => {
    if (!slug) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log(`Fetching category with slug: ${slug}`)
      const data = await container.services.regulationCategories.getCategoryBySlug(slug)
      console.log(`Category data for slug ${slug}:`, data)
      setCategory(data)
      if (!data) {
        setError("Category not found")
      }
    } catch (error) {
      console.error(`Error fetching regulation category with slug ${slug}:`, error)
      setError("Failed to load regulation category. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  return { category, loading, error, refetch: fetchCategory }
}
