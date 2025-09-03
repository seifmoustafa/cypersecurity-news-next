import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { ProcedureSafeguard } from "../domain/models/procedure"

export function useProcedureSafeguards(
  controlId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  const [safeguards, setSafeguards] = useState<ProcedureSafeguard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    itemsCount: 0,
    pagesCount: 0,
    pageSize: 10,
    currentPage: 1,
  })

  useEffect(() => {
    const fetchSafeguards = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.procedures.getSafeguardsByControlId(
          controlId,
          page,
          pageSize,
          search
        )
        setSafeguards(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error("Error fetching procedure safeguards:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch procedure safeguards")
        setSafeguards([])
      } finally {
        setLoading(false)
      }
    }

    if (controlId) {
      fetchSafeguards()
    }
  }, [controlId, page, pageSize, search])

  return {
    safeguards,
    loading,
    error,
    pagination,
  }
}
