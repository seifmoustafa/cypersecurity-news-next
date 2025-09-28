import { useState, useEffect } from 'react'
import type { PersonalProtectControl, PersonalProtectControlsResponse } from '@/entities'
import { container } from '@/core/di/container'

interface UsePersonalProtectControlsResult {
  controls: PersonalProtectControl[]
  loading: boolean
  error: string | null
  pagination: PersonalProtectControlsResponse['pagination'] | null
}

export function usePersonalProtectControls(
  subCategoryId: string,
  search?: string,
  page: number = 1,
  pageSize: number = 10
): UsePersonalProtectControlsResult {
  const [controls, setControls] = useState<PersonalProtectControl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PersonalProtectControlsResponse['pagination'] | null>(null)

  useEffect(() => {
    if (!subCategoryId) {
      setLoading(false)
      return
    }

    const fetchControls = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await container.services.personalProtectControl.getPersonalProtectControlsBySubCategoryId(subCategoryId, page, pageSize, search)
        setControls(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching personal protect controls:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch personal protect controls')
        setControls([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchControls()
  }, [subCategoryId, search, page, pageSize])

  return {
    controls,
    loading,
    error,
    pagination
  }
}