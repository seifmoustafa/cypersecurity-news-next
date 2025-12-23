import type { NewsRepository } from "../../domain/repositories/news-repository"
import type { News, NewsResponse, LatestNews, NewsCategory, NewsCategoriesResponse } from "../../domain/models/news"
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

      const response = await this.apiDataSource.get<NewsResponse>("/news/byCategory?page=1&pageSize=100")
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

  async getNewsByCategory(categoryId: string | null, page = 1, pageSize = 10, search?: string): Promise<News[]> {
    try {
      let endpoint: string
      
      if (categoryId && categoryId !== "all" && categoryId.trim() !== "") {
        console.log(`🔍 Fetching news for specific category ID: "${categoryId}"`)
        endpoint = `/News/beginners/${categoryId}?page=${page}&pageSize=${pageSize}`
        
        if (search && search.trim()) {
          endpoint += `&search=${encodeURIComponent(search.trim())}`
        }
      } else {
        console.log("🔍 Fetching ALL news (no category filter)")
        endpoint = `/news/byCategory?page=${page}&pageSize=${pageSize}`
        
        if (search && search.trim()) {
          endpoint += `&search=${encodeURIComponent(search.trim())}`
        }
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

  async getNewsByCategoryForProfessionals(categoryId: string | null, page = 1, pageSize = 10, search?: string): Promise<News[]> {
    try {
      let endpoint: string
      
      if (categoryId && categoryId !== "all" && categoryId.trim() !== "") {
        console.log(`🔍 Fetching news for specific category ID: "${categoryId}" (professionals)`)
        endpoint = `/News/professionals/${categoryId}?page=${page}&pageSize=${pageSize}`
        
        if (search && search.trim()) {
          endpoint += `&search=${encodeURIComponent(search.trim())}`
        }
      } else {
        console.log("🔍 Fetching ALL news (no category filter) (professionals)")
        endpoint = `/News/professionals/3d25ba9f-3a6f-4c04-bfb0-488cc22822ed?page=${page}&pageSize=${pageSize}`
        
        if (search && search.trim()) {
          endpoint += `&search=${encodeURIComponent(search.trim())}`
        }
      }

      console.log(`📡 API endpoint: ${endpoint}`)
      const response = await this.apiDataSource.get<NewsResponse>(endpoint)
      const newsData = this.transformNewsData(response.data)

      console.log(`✅ Successfully fetched ${newsData.length} news items`)
      return newsData
    } catch (error) {
      console.error(`❌ Error fetching news by category "${categoryId}" (professionals):`, error)
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

  async getNewsCategories(page = 1, pageSize = 10, search?: string): Promise<NewsCategoriesResponse> {
    try {
      let endpoint = `/NewsCategories?page=${page}&pageSize=${pageSize}`
      
      if (search && search.trim()) {
        endpoint += `&search=${encodeURIComponent(search.trim())}`
      }
      
      const response = await this.apiDataSource.get<NewsCategoriesResponse>(endpoint)
      return {
        ...response,
        data: response.data.map(category => this.transformNewsCategory(category))
      }
    } catch (error) {
      console.error("Error fetching news categories:", error)
      throw error
    }
  }

  async getNewsCategoryById(id: string): Promise<NewsCategory | null> {
    try {
      console.log(`🔍 Fetching news category by ID: ${id}`)
      const endpoint = `/NewsCategories/${id}`
      const category = await this.apiDataSource.get<NewsCategory>(endpoint)
      console.log(`✅ Successfully fetched news category with ID ${id}`)
      return this.transformNewsCategory(category)
    } catch (error) {
      console.error(`❌ Error fetching news category by ID ${id}:`, error)
      return null
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
      date: item.date,
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
      content: item.content || "",
      contentEn: item.contentEn,
      summary: item.summary,
      summaryEn: item.summaryEn,
      // Apply the same image URL transformation
      imageUrl: item.imageUrl ? `${this.baseImageUrl}${item.imageUrl}` : null,
      date: item.date,
      tags: item.tags || [],
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt,
      featured: true,
      category: "latest",
    }
  }

  async getLatestNewsForBeginners(): Promise<News[]> {
    try {
      console.log("NewsRepositoryImpl: Fetching latest news for beginners")
      const response = await this.apiDataSource.get<News[]>("/News/last10-for-beginners")
      console.log(`NewsRepositoryImpl: Successfully retrieved ${response.length} latest news items for beginners`)
      
      return response.map(item => this.transformNewsItem(item))
    } catch (error) {
      console.error("NewsRepositoryImpl: Error fetching latest news for beginners:", error)
      return []
    }
  }

  private transformNewsCategory(category: NewsCategory): NewsCategory {
    return {
      ...category,
      // Transform image URL to full URL for simple pages only
      imageUrl: category.imageUrl ? `${this.baseImageUrl}${category.imageUrl}` : null,
    }
  }
}
