import { useState, useEffect } from 'react'
import type { PersonalProtectControlStep } from '@/entities'
import { container } from '@/core/di/container'

interface UsePersonalProtectControlStepResult {
  step: PersonalProtectControlStep | null
  loading: boolean
  error: string | null
}

export function usePersonalProtectControlStep(stepId: string): UsePersonalProtectControlStepResult {
  const [step, setStep] = useState<PersonalProtectControlStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stepId) {
      setLoading(false)
      return
    }

    const fetchStep = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await container.services.personalProtectControlStep.getPersonalProtectControlStepById(stepId)
        setStep(response)
      } catch (err) {
        console.error('Error fetching personal protect control step:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch personal protect control step')
        setStep(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStep()
  }, [stepId])

  return {
    step,
    loading,
    error
  }
}
