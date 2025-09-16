"use client"

import { useState, useEffect } from "react"
import { container } from "../di/container"
import type { System } from "../domain/models/system"

export function usePinnedSystem() {
  const [pinnedSystem, setPinnedSystem] = useState<System | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPinnedSystem = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("🔄 Fetching pinned system...")
        
        const data = await container.services.systems.getPinnedSystem()
        setPinnedSystem(data)
        
        if (data) {
          console.log("✅ Pinned system found:", data.name)
        } else {
          console.log("ℹ️ No pinned system found")
        }
      } catch (err) {
        console.error("❌ Error fetching pinned system:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch pinned system"))
        setPinnedSystem(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPinnedSystem()
  }, [])

  return { pinnedSystem, loading, error }
}
