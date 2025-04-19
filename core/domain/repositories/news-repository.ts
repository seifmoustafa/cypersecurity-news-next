import type { News } from "../models/news"

export interface NewsRepository {
  getAllNews(): Promise<News[]>
  getNewsById(id: string): Promise<News | null>
  getNewsByCategory(category: string): Promise<News[]>
  getLatestNews(count: number): Promise<News[]>
  getFeaturedNews(): Promise<News[]>
}
