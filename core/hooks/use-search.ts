import { useState, useCallback } from "react"
import { container } from "../di/container"
import type { SearchResponse } from "../services/search-service"

export function useSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResponse | null>(null)

  const search = useCallback(async (
    query: string,
    page: number = 1,
    pageSize: number = 10,
    includeInactive: boolean = false,
    englishOnly: boolean = false,
    arabicOnly: boolean = false
  ) => {
    if (!query.trim()) {
      setResults(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchService = container.searchService
      if (!searchService) {
        throw new Error("Search service not available")
      }

      const data = await searchService.search(
        query,
        page,
        pageSize,
        includeInactive,
        englishOnly,
        arabicOnly
      )
      setResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed"
      setError(errorMessage)
      setResults(null)
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return {
    search,
    clearResults,
    loading,
    error,
    results,
  }
}
