import { useState, useEffect } from "react";
import { container } from "@/core/di/container";
import type { News } from "@/core/domain/models/news";

export function useLatestNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.news.getLatestNewsForBeginners();
        setNews(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch latest news");
        console.error("Error fetching latest news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const refetch = () => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.news.getLatestNewsForBeginners();
        setNews(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch latest news");
        console.error("Error fetching latest news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  };

  return { news, loading, error, refetch };
}
