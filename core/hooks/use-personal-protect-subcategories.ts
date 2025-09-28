import { useState, useEffect } from 'react'
import type { PersonalProtectSubCategory, PersonalProtectSubCategoriesResponse } from '@/entities'
import { container } from '@/core/di/container'

interface UsePersonalProtectSubCategoriesResult {
  subCategories: PersonalProtectSubCategory[]
  loading: boolean
  error: string | null
  pagination: PersonalProtectSubCategoriesResponse['pagination'] | null
}

export function usePersonalProtectSubCategories(
  categoryId: string,
  search?: string,
  page: number = 1,
  pageSize: number = 10
): UsePersonalProtectSubCategoriesResult {
  const [subCategories, setSubCategories] = useState<PersonalProtectSubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PersonalProtectSubCategoriesResponse['pagination'] | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setLoading(false)
      return
    }

    const fetchSubCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await container.services.personalProtectSubCategory.getPersonalProtectSubCategoriesByCategoryId(categoryId, page, pageSize, search)
        setSubCategories(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching personal protect subcategories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch personal protect subcategories')
        setSubCategories([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSubCategories()
  }, [categoryId, search, page, pageSize])

  return {
    subCategories,
    loading,
    error,
    pagination
  }
}
