import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { ProcedureTechnique } from "../domain/models/procedure"

export function useProcedureTechniques(
  safeguardId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  const [techniques, setTechniques] = useState<ProcedureTechnique[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1,
  })

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.procedures.getTechniquesBySafeguardId(
          safeguardId,
          page,
          pageSize,
          search
        )
        setTechniques(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error("Error fetching procedure techniques:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch procedure techniques")
        setTechniques([])
      } finally {
        setLoading(false)
      }
    }

    if (safeguardId) {
      fetchTechniques()
    }
  }, [safeguardId, page, pageSize, search])

  return {
    techniques,
    loading,
    error,
    pagination,
  }
}
