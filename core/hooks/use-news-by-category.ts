import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { News } from "@/core/domain/models/news"

interface UseNewsByCategoryReturn {
  news: News[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNewsByCategory(
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseNewsByCategoryReturn {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNewsByCategory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await container.services.news.getNewsByCategory(categoryId, page, pageSize, search)
      setNews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [categoryId, page, pageSize, search])

  useEffect(() => {
    fetchNewsByCategory()
  }, [fetchNewsByCategory])

  return { news, loading, error, refetch: fetchNewsByCategory }
}
