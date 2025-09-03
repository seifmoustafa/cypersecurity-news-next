import { useState, useEffect } from "react"
import { container } from "../di/container"
import { PersonalProtectCategory } from "../domain/models/personal-protect"

interface UsePersonalProtectCategoriesReturn {
  categories: PersonalProtectCategory[]
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

export function usePersonalProtectCategories(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UsePersonalProtectCategoriesReturn {
  const [categories, setCategories] = useState<PersonalProtectCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1
  })

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await container.personalProtectService.getAllPersonalProtectCategories(
        page,
        pageSize,
        search
      )
      
      setCategories(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [page, pageSize, search])

  return {
    categories,
    loading,
    error,
    pagination,
    refetch: fetchCategories
  }
}
