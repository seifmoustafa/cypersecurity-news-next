import type { NewsRepository } from "../domain/repositories/news-repository"
import type { News } from "../domain/models/news"

export class NewsService {
  private repository: NewsRepository

  constructor(repository: NewsRepository) {
    this.repository = repository
  }

  async getAllNews(): Promise<News[]> {
    return this.repository.getAllNews()
  }

  async getNewsById(id: string): Promise<News | null> {
    return this.repository.getNewsById(id)
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    return this.repository.getNewsByCategory(category)
  }

  async getLatestNews(count: number): Promise<News[]> {
    return this.repository.getLatestNews(count)
  }

  async getFeaturedNews(): Promise<News[]> {
    return this.repository.getFeaturedNews()
  }
}
