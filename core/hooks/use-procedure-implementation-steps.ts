import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { ProcedureImplementationStep } from "../domain/models/procedure"

export function useProcedureImplementationSteps(
  techniqueId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  const [implementationSteps, setImplementationSteps] = useState<ProcedureImplementationStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1,
  })

  useEffect(() => {
    const fetchImplementationSteps = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.procedures.getImplementationStepsByTechniqueId(
          techniqueId,
          page,
          pageSize,
          search
        )
        setImplementationSteps(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error("Error fetching procedure implementation steps:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch procedure implementation steps")
        setImplementationSteps([])
      } finally {
        setLoading(false)
      }
    }

    if (techniqueId) {
      fetchImplementationSteps()
    }
  }, [techniqueId, page, pageSize, search])

  return {
    implementationSteps,
    loading,
    error,
    pagination,
  }
}
