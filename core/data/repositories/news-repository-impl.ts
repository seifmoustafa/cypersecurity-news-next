import type { NewsRepository } from "../../domain/repositories/news-repository"
import type { News, NewsResponse, LatestNews } from "../../domain/models/news"
import type { NewsCategory, NewsCategoriesResponse } from "../../domain/models/news-category"
import type { ApiDataSource } from "../sources/api-data-source"
import { slugify } from "@/lib/utils"

export class NewsRepositoryImpl implements NewsRepository {
  private apiDataSource: ApiDataSource
  private baseImageUrl: string
  private newsCache: News[] | null = null

  constructor(apiDataSource: ApiDataSource) {
    this.apiDataSource = apiDataSource
    this.baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
  }

  async getAllNews(): Promise<News[]> {
    try {
      if (this.newsCache) {
        return this.newsCache
      }

      const response = await this.apiDataSource.get<NewsResponse>("/News/byCategory?page=1&pageSize=100")
      this.newsCache = this.transformNewsData(response.data)
      return this.newsCache
    } catch (error) {
      console.error("Error fetching all news:", error)
      throw error
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    try {
      // Call the specific API endpoint for a single news item
      const news = await this.apiDataSource.get<News>(`/News/${id}`)
      return this.transformNewsItem(news)
    } catch (error) {
      console.error("Error fetching news by ID:", error)
      return null
    }
  }

  async getNewsBySlug(slug: string): Promise<News | null> {
    try {
      console.log(`Looking for news with slug: ${slug}`)

      // Get all news
      const allNews = await this.getAllNews()

      // Debug: Log all titles and their slugs
      allNews.forEach((news) => {
        const titleSlug = slugify(news.title || "")
        const titleEnSlug = slugify(news.titleEn || "")
        console.log(`News ID: ${news.id}, Title slug: ${titleSlug}, TitleEn slug: ${titleEnSlug}`)
      })

      // Find the news item with a matching slug
      const foundNews = allNews.find((news) => {
        const titleSlug = slugify(news.title || "")
        const titleEnSlug = slugify(news.titleEn || "")

        // Check if either slug matches
        const matches = slug === titleSlug || slug === titleEnSlug
        if (matches) {
          console.log(`Found matching news with ID: ${news.id}`)
        }
        return matches
      })

      if (foundNews) {
        // Fetch the full article details using the ID
        return await this.getNewsById(foundNews.id)
      }

      console.log("No matching news found for slug:", slug)
      return null
    } catch (error) {
      console.error("Error fetching news by slug:", error)
      return null
    }
  }

  async getNewsByCategory(categoryId: string | null, page = 1, pageSize = 10): Promise<News[]> {
    try {
      let endpoint = `/News/byCategory?page=${page}&pageSize=${pageSize}`
      if (categoryId && categoryId !== "all") {
        endpoint += `&categoryId=${categoryId}`
      }

      const response = await this.apiDataSource.get<NewsResponse>(endpoint)
      return this.transformNewsData(response.data)
    } catch (error) {
      console.error("Error fetching news by category:", error)
      throw error
    }
  }

  async getLatestNews(count = 5): Promise<News[]> {
    try {
      const response = await this.apiDataSource.get<LatestNews[]>("/News/last5")
      return response.map((item) => this.transformLatestNewsItem(item))
    } catch (error) {
      console.error("Error fetching latest news:", error)
      throw error
    }
  }

  async getFeaturedNews(): Promise<News[]> {
    try {
      // Use latest news as featured for now
      return await this.getLatestNews(5)
    } catch (error) {
      console.error("Error fetching featured news:", error)
      throw error
    }
  }

  async getNewsCategories(page = 1, pageSize = 10): Promise<NewsCategory[]> {
    try {
      const response = await this.apiDataSource.get<NewsCategoriesResponse>(
        `/NewsCategories?page=${page}&pageSize=${pageSize}`,
      )
      return response.data
    } catch (error) {
      console.error("Error fetching news categories:", error)
      throw error
    }
  }

  private transformNewsData(newsItems: News[]): News[] {
    return newsItems.map((item) => this.transformNewsItem(item))
  }

  private transformNewsItem(item: News): News {
    return {
      ...item,
      // Add full image URL if imageUrl exists
      imageUrl: item.imageUrl ? `${this.baseImageUrl}${item.imageUrl}` : null,
      // Use createdAt as date if date is null
      date: item.date || item.createdAt,
      // Add UI compatibility fields
      featured: false,
      category: "general",
    }
  }

  private transformLatestNewsItem(item: LatestNews): News {
    return {
      id: item.id,
      title: item.title,
      titleEn: item.titleEn,
      content: "",
      contentEn: null,
      summary: null,
      summaryEn: null,
      // Apply the same image URL transformation
      imageUrl: item.imageUrl ? `${this.baseImageUrl}${item.imageUrl}` : null,
      date: new Date().toISOString(),
      tags: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      featured: true,
      category: "latest",
    }
  }
}
