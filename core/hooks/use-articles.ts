"use client"

import { useState, useEffect, useCallback } from "react"
import { container } from "@/core/di/container"
import type { ApiArticle, ArticlesPaginatedResponse } from "@/core/domain/models/media"

interface UseArticlesReturn {
  articles: ApiArticle[]
  loading: boolean
  error: string | null
  pagination: ArticlesPaginatedResponse["pagination"] | null
  refetch: () => Promise<void>
}

export function useArticles(
  page: number = 1,
  pageSize: number = 10,
  search?: string
): UseArticlesReturn {
  const [articles, setArticles] = useState<ApiArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ArticlesPaginatedResponse["pagination"] | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.media.getArticles(page, pageSize, search)
        setArticles(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setArticles([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [page, pageSize, search])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await container.services.media.getArticles(page, pageSize, search)
      setArticles(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setArticles([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search])

  return { articles, loading, error, pagination, refetch }
}

export function useLatestArticles(count: number = 3): {
  articles: ApiArticle[]
  loading: boolean
  error: string | null
} {
  const [articles, setArticles] = useState<ApiArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.media.getArticles(1, count)
        setArticles(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchLatestArticles()
  }, [count])

  return { articles, loading, error }
}