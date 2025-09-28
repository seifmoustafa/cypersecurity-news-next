import { useState, useEffect } from 'react'
import type { PersonalProtectControlStep, PersonalProtectControlStepsResponse } from '@/entities'
import { container } from '@/core/di/container'

interface UsePersonalProtectControlStepsResult {
  steps: PersonalProtectControlStep[]
  loading: boolean
  error: string | null
  pagination: PersonalProtectControlStepsResponse['pagination'] | null
}

export function usePersonalProtectControlSteps(
  controlId: string,
  search?: string,
  page: number = 1,
  pageSize: number = 10
): UsePersonalProtectControlStepsResult {
  const [steps, setSteps] = useState<PersonalProtectControlStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PersonalProtectControlStepsResponse['pagination'] | null>(null)

  useEffect(() => {
    if (!controlId) {
      setLoading(false)
      return
    }

    const fetchSteps = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await container.services.personalProtectControlStep.getPersonalProtectControlStepsByControlId(controlId, page, pageSize, search)
        setSteps(response.data)
        setPagination(response.pagination)
      } catch (err) {
        console.error('Error fetching personal protect control steps:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch personal protect control steps')
        setSteps([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSteps()
  }, [controlId, search, page, pageSize])

  return {
    steps,
    loading,
    error,
    pagination
  }
}