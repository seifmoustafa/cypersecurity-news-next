import { useState, useEffect } from "react"
import { container } from "../di/container"
import { PersonalProtectControlStep } from "../domain/models/personal-protect"

interface UsePersonalProtectControlStepsReturn {
  steps: PersonalProtectControlStep[]
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

export function usePersonalProtectControlSteps(
  controlId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UsePersonalProtectControlStepsReturn {
  const [steps, setSteps] = useState<PersonalProtectControlStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1
  })

  const fetchSteps = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await container.personalProtectService.getStepsByControlId(
        controlId,
        page,
        pageSize,
        search
      )
      
      setSteps(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setSteps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (controlId) {
      fetchSteps()
    }
  }, [controlId, page, pageSize, search])

  return {
    steps,
    loading,
    error,
    pagination,
    refetch: fetchSteps
  }
}
