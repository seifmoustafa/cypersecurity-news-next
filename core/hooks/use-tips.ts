"use client"

import { useState, useCallback } from "react"
import { container } from "../di/container"
import type { Tip } from "@/entities"

export function useTips() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchRandomTip = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const randomTip = await container.services.tips.getRandomTip()
      setTip(randomTip)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch tip")
      setError(error)
      console.error("Error fetching random tip:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    tip,
    loading,
    error,
    fetchRandomTip,
  }
}
