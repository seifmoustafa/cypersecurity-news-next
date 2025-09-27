import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { News } from "@/core/domain/models/news"

interface UseNewsReturn {
  news: News[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseLatestNewsReturn {
  news: News[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNews(
  categoryId: string | null = null,
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseNewsReturn {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
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
    fetchNews()
  }, [fetchNews])

  return { news, loading, error, refetch: fetchNews }
}

export function useLatestNews(count = 5): UseLatestNewsReturn {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLatestNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await container.services.news.getLatestNews(count)
      setNews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [count])

  useEffect(() => {
    fetchLatestNews()
  }, [fetchLatestNews])

  return { news, loading, error, refetch: fetchLatestNews }
}