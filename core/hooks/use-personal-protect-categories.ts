import { useState, useEffect } from 'react'
import type { PersonalProtectCategory, PersonalProtectCategoriesResponse } from '@/entities'
import { container } from '@/core/di/container'

interface UsePersonalProtectCategoriesResult {
  categories: PersonalProtectCategory[]
  loading: boolean
  error: string | null
  pagination: PersonalProtectCategoriesResponse['pagination'] | null
}

export function usePersonalProtectCategories(
  search?: string,
  page: number = 1,
  pageSize: number = 10
): UsePersonalProtectCategoriesResult {
  const [categories, setCategories] = useState<PersonalProtectCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PersonalProtectCategoriesResponse['pagination'] | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await container.services.personalProtectCategory.getPersonalProtectCategories(page, pageSize, search)
        setCategories(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching personal protect categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch personal protect categories')
        setCategories([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [search, page, pageSize])

  return {
    categories,
    loading,
    error,
    pagination
  }
}