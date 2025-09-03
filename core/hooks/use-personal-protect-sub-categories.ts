import { useState, useEffect } from "react"
import { container } from "../di/container"
import { PersonalProtectSubCategory } from "../domain/models/personal-protect"

interface UsePersonalProtectSubCategoriesReturn {
  subCategories: PersonalProtectSubCategory[]
  loading: boolean
  error: string | null
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
  refetch: () => void
}

export function usePersonalProtectSubCategories(
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UsePersonalProtectSubCategoriesReturn {
  const [subCategories, setSubCategories] = useState<PersonalProtectSubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1
  })

  const fetchSubCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await container.personalProtectService.getSubCategoriesByCategoryId(
        categoryId,
        page,
        pageSize,
        search
      )
      
      setSubCategories(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setSubCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId) {
      fetchSubCategories()
    }
  }, [categoryId, page, pageSize, search])

  return {
    subCategories,
    loading,
    error,
    pagination,
    refetch: fetchSubCategories
  }
}
