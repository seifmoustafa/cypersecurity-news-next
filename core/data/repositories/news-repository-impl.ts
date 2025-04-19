import type { NewsRepository } from "../../domain/repositories/news-repository"
import type { News } from "../../domain/models/news"
import type { MockDataSource } from "../sources/mock-data-source"

export class NewsRepositoryImpl implements NewsRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllNews(): Promise<News[]> {
    return this.dataSource.getAllNews()
  }

  async getNewsById(id: string): Promise<News | null> {
    return this.dataSource.getNewsById(id)
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    return this.dataSource.getNewsByCategory(category)
  }

  async getLatestNews(count: number): Promise<News[]> {
    return this.dataSource.getLatestNews(count)
  }

  async getFeaturedNews(): Promise<News[]> {
    return this.dataSource.getFeaturedNews()
  }
}
