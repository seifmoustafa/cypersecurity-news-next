import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { ProcedureControl } from "../domain/models/procedure"

export function useProcedureControls(
  procedureId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  const [controls, setControls] = useState<ProcedureControl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1,
  })

  useEffect(() => {
    const fetchControls = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.procedures.getControlsByProcedureId(
          procedureId,
          page,
          pageSize,
          search
        )
        setControls(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error("Error fetching procedure controls:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch procedure controls")
        setControls([])
      } finally {
        setLoading(false)
      }
    }

    if (procedureId) {
      fetchControls()
    }
  }, [procedureId, page, pageSize, search])

  return {
    controls,
    loading,
    error,
    pagination,
  }
}
