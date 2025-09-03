import { useState, useEffect } from "react"
import { container } from "../di/container"
import { PersonalProtectControl } from "../domain/models/personal-protect"

interface UsePersonalProtectControlsReturn {
  controls: PersonalProtectControl[]
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

export function usePersonalProtectControls(
  subCategoryId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UsePersonalProtectControlsReturn {
  const [controls, setControls] = useState<PersonalProtectControl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1
  })

  const fetchControls = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await container.personalProtectService.getControlsBySubCategoryId(
        subCategoryId,
        page,
        pageSize,
        search
      )
      
      setControls(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setControls([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (subCategoryId) {
      fetchControls()
    }
  }, [subCategoryId, page, pageSize, search])

  return {
    controls,
    loading,
    error,
    pagination,
    refetch: fetchControls
  }
}
