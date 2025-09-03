import type { NewsRepository } from "../../domain/repositories/news-repository"
import type { News, NewsResponse, LatestNews, NewsCategory, NewsCategoriesResponse } from "../../../entities"
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
      console.log(`📡 Fetching news by ID: ${id}`)
      // First try to use cache if available
      if (this.newsCache) {
        const cachedNews = this.newsCache.find((item) => item.id === id)
        if (cachedNews) {
          console.log(`✅ Found news with ID ${id} in cache`)
          return cachedNews
        }
      }

      // Call the specific API endpoint for a single news item
      const newsItem = await this.apiDataSource.get<News>(`/News/${id}`)
      console.log(`✅ Successfully fetched news with ID ${id} from API`)
      return this.transformNewsItem(newsItem)
    } catch (error) {
      console.error(`❌ Error fetching news by ID ${id}:`, error)
      return null
    }
  }

  async getNewsBySlug(slug: string): Promise<News | null> {
    try {
      console.log(`Looking for news with slug: ${slug}`)

      // Get all news
      const allNews = await this.getAllNews()

      // Find the news item with a matching slug
      const foundNews = allNews.find((news) => {
        const slugToMatch = slugify(news.titleEn || "", news.id)
        const matches = slug === slugToMatch
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

  async getNewsByCategory(categoryId: string | null, page = 1, pageSize = 100): Promise<News[]> {
    try {
      let endpoint = `/News/byCategory?page=${page}&pageSize=${pageSize}`

      // Only add categoryId if it's not null and not empty
      if (categoryId && categoryId !== "all" && categoryId.trim() !== "") {
        console.log(`🔍 Fetching news for specific category ID: "${categoryId}"`)
        endpoint += `&categoryId=${encodeURIComponent(categoryId)}`
      } else {
        console.log("🔍 Fetching ALL news (no category filter)")
      }

      console.log(`📡 API endpoint: ${endpoint}`)
      const response = await this.apiDataSource.get<NewsResponse>(endpoint)
      const newsData = this.transformNewsData(response.data)

      console.log(`✅ Successfully fetched ${newsData.length} news items`)
      return newsData
    } catch (error) {
      console.error(`❌ Error fetching news by category "${categoryId}":`, error)
      // DON'T FALLBACK TO ALL NEWS - Let the error bubble up
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
      date: item.date || item.createdAt || new Date().toISOString(),
      tags: [],
      isActive: true,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: null,
      featured: true,
      category: "latest",
    }
  }
}
