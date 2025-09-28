import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { SearchResult, SearchResponse } from "@/core/services/search-service"

interface UseSearchReturn {
  results: SearchResult[]
  loading: boolean
  error: string | null
  pagination: SearchResponse["pagination"] | null
  metadata: SearchResponse["metadata"] | null
  refetch: () => Promise<void>
}

export function useSearch(
  query: string,
  page: number = 1,
  pageSize: number = 10,
  includeInactive: boolean = false,
  englishOnly: boolean = false,
  arabicOnly: boolean = false
): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<SearchResponse["pagination"] | null>(null)
  const [metadata, setMetadata] = useState<SearchResponse["metadata"] | null>(null)

  const fetchSearchResults = useCallback(async () => {
    if (!query.trim()) {
      setResults([])
      setPagination(null)
      setMetadata(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await container.services.search.search(
        query,
        page,
        pageSize,
        includeInactive,
        englishOnly,
        arabicOnly
      )
      setResults(data.allResults)
      setPagination(data.pagination)
      setMetadata(data.metadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while searching")
      setResults([])
      setPagination(null)
      setMetadata(null)
    } finally {
      setLoading(false)
    }
  }, [query, page, pageSize, includeInactive, englishOnly, arabicOnly])

  useEffect(() => {
    fetchSearchResults()
  }, [fetchSearchResults])

  return { 
    results, 
    loading, 
    error, 
    pagination, 
    metadata, 
    refetch: fetchSearchResults 
  }
}