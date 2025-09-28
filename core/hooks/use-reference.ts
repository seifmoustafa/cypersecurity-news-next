import { useState, useEffect } from 'react'
import type { Reference } from '@/entities'
import { container } from '@/core/di/container'

interface UseReferenceResult {
  reference: Reference | null
  loading: boolean
  error: string | null
}

export function useReference(id: string): UseReferenceResult {
  const [reference, setReference] = useState<Reference | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchReference = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await container.services.reference.getReferenceById(id)
        setReference(data)
      } catch (err) {
        console.error('Error fetching reference:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch reference')
        setReference(null)
      } finally {
        setLoading(false)
      }
    }

    fetchReference()
  }, [id])

  return {
    reference,
    loading,
    error
  }
}
