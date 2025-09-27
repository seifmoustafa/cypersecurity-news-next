import type { News, NewsCategory, NewsCategoriesResponse } from "../models/news"

export interface NewsRepository {
  getAllNews(): Promise<News[]>
  getNewsById(id: string): Promise<News | null>
  getNewsBySlug(slug: string): Promise<News | null>
  getNewsByCategory(categoryId: string | null, page?: number, pageSize?: number, search?: string): Promise<News[]>
  getLatestNews(count?: number): Promise<News[]>
  getFeaturedNews(): Promise<News[]>
  getNewsCategories(page?: number, pageSize?: number, search?: string): Promise<NewsCategoriesResponse>
}
