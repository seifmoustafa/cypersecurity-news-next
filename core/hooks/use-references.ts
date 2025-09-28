import { useState, useEffect } from 'react'
import type { Reference, ReferenceResponse } from '@/entities'
import { container } from '@/core/di/container'

interface UseReferencesResult {
  references: Reference[]
  loading: boolean
  error: string | null
  pagination: ReferenceResponse['pagination'] | null
}

export function useReferences(
  search?: string,
  page: number = 1,
  pageSize: number = 10
): UseReferencesResult {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ReferenceResponse['pagination'] | null>(null)

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await container.services.reference.getReferences(page, pageSize, search)
        setReferences(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching references:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch references')
        setReferences([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchReferences()
  }, [search, page, pageSize])

  return {
    references,
    loading,
    error,
    pagination
  }
}
