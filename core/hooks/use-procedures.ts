import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { Procedure } from "../domain/models/procedure"

export function useProcedures(page: number = 1, pageSize: number = 10, search?: string) {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1,
  })

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await container.services.procedures.getAllProcedures(page, pageSize, search)
        setProcedures(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error("Error fetching procedures:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch procedures")
        setProcedures([])
      } finally {
        setLoading(false)
      }
    }

    fetchProcedures()
  }, [page, pageSize, search])

  const refetch = () => {
    setLoading(true)
    const fetchProcedures = async () => {
      try {
        setError(null)
        const response = await container.services.procedures.getAllProcedures(page, pageSize, search)
        setProcedures(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error("Error fetching procedures:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch procedures")
        setProcedures([])
      } finally {
        setLoading(false)
      }
    }
    fetchProcedures()
  }

  return {
    procedures,
    loading,
    error,
    pagination,
    refetch,
  }
}
