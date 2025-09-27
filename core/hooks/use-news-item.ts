import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { News } from "@/core/domain/models/news"

interface UseNewsItemReturn {
  news: News | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNewsItem(id: string | null): UseNewsItemReturn {
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNewsItem = useCallback(async () => {
    if (!id) {
      setNews(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await container.services.news.getNewsById(id)
      setNews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setNews(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchNewsItem()
  }, [fetchNewsItem])

  return { news, loading, error, refetch: fetchNewsItem }
}
