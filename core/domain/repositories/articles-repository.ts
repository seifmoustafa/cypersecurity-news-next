import type { Article } from "../../../entities"

export interface ArticlesRepository {
  getAllArticles(page?: number, pageSize?: number): Promise<Article[]>
  getArticleById(id: string): Promise<Article | null>
  getArticleBySlug(slug: string): Promise<Article | null>
  getLatestArticles(count?: number): Promise<Article[]>
}
