import type { NewsRepository } from "../domain/repositories/news-repository"
import type { News, NewsCategory } from "../../entities"

export class NewsService {
  private repository: NewsRepository

  constructor(repository: NewsRepository) {
    this.repository = repository
  }

  async getAllNews(): Promise<News[]> {
    try {
      return await this.repository.getAllNews()
    } catch (error) {
      console.error("NewsService: Error getting all news:", error)
      return []
    }
  }

  async getNewsById(id: string): Promise<News | null> {
    try {
      console.log(`NewsService: Fetching news by ID ${id}`)
      const news = await this.repository.getNewsById(id)
      if (news) {
        console.log(`NewsService: Successfully retrieved news with ID ${id}`)
      } else {
        console.warn(`NewsService: No news found with ID ${id}`)
      }
      return news
    } catch (error) {
      console.error(`NewsService: Error getting news by ID ${id}:`, error)
      return null
    }
  }

  async getNewsBySlug(slug: string): Promise<News | null> {
    try {
      return await this.repository.getNewsBySlug(slug)
    } catch (error) {
      console.error(`NewsService: Error getting news by slug "${slug}":`, error)
      return null
    }
  }

  async getNewsByCategory(categoryId: string | null, page = 1, pageSize = 10): Promise<News[]> {
    try {
      return await this.repository.getNewsByCategory(categoryId, page, pageSize)
    } catch (error) {
      console.error("NewsService: Error getting news by category:", error)
      return []
    }
  }

  async getLatestNews(count = 5): Promise<News[]> {
    try {
      return await this.repository.getLatestNews(count)
    } catch (error) {
      console.error("NewsService: Error getting latest news:", error)
      return []
    }
  }

  async getFeaturedNews(): Promise<News[]> {
    try {
      return await this.repository.getFeaturedNews()
    } catch (error) {
      console.error("NewsService: Error getting featured news:", error)
      return []
    }
  }

  async getNewsCategories(page = 1, pageSize = 10): Promise<NewsCategory[]> {
    try {
      return await this.repository.getNewsCategories(page, pageSize)
    } catch (error) {
      console.error("NewsService: Error getting news categories:", error)
      return []
    }
  }
}
