import { useEffect, useState } from "react"
import { container } from "@/core/di/container"
import type { Definition } from "../domain/models/definition"

interface UseDefinitionReturn {
  definition: Definition | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDefinition(id: string): UseDefinitionReturn {
  const [definition, setDefinition] = useState<Definition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDefinition = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await container.services.definitions.getDefinitionById(id)
      setDefinition(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setDefinition(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchDefinition()
    }
  }, [id])

  return { definition, loading, error, refetch: fetchDefinition }
}
