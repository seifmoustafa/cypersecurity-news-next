import type { ArticlesRepository } from "../domain/repositories/articles-repository"
import type { Article } from "../domain/models/article"

export class ArticlesService {
  private repository: ArticlesRepository

  constructor(repository: ArticlesRepository) {
    this.repository = repository
  }

  async getAllArticles(page = 1, pageSize = 10): Promise<Article[]> {
    try {
      return await this.repository.getAllArticles(page, pageSize)
    } catch (error) {
      console.error("ArticlesService: Error getting all articles:", error)
      return []
    }
  }

  async getArticleById(id: string): Promise<Article | null> {
    try {
      console.log(`ArticlesService: Fetching article by ID ${id}`)
      const article = await this.repository.getArticleById(id)
      if (article) {
        console.log(`ArticlesService: Successfully retrieved article with ID ${id}`)
      } else {
        console.warn(`ArticlesService: No article found with ID ${id}`)
      }
      return article
    } catch (error) {
      console.error(`ArticlesService: Error getting article by ID ${id}:`, error)
      return null
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      return await this.repository.getArticleBySlug(slug)
    } catch (error) {
      console.error(`ArticlesService: Error getting article by slug "${slug}":`, error)
      return null
    }
  }

  async getLatestArticles(count = 3): Promise<Article[]> {
    try {
      return await this.repository.getLatestArticles(count)
    } catch (error) {
      console.error("ArticlesService: Error getting latest articles:", error)
      return []
    }
  }
}
