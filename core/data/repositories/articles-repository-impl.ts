import type { ArticlesRepository } from "../../domain/repositories/articles-repository"
import type { Article, ArticleResponse, LatestArticle } from "../../domain/models/article"
import type { ApiDataSource } from "../sources/api-data-source"
import { slugify } from "@/lib/utils"

export class ArticlesRepositoryImpl implements ArticlesRepository {
  private apiDataSource: ApiDataSource
  private baseImageUrl: string
  private articlesCache: Article[] | null = null

  constructor(apiDataSource: ApiDataSource) {
    this.apiDataSource = apiDataSource
    this.baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
  }

  async getAllArticles(page = 1, pageSize = 10): Promise<Article[]> {
    try {
      const response = await this.apiDataSource.get<ArticleResponse>(`/Articles?page=${page}&pageSize=${pageSize}`)
      return this.transformArticlesData(response.data)
    } catch (error) {
      console.error("Error fetching all articles:", error)
      throw error
    }
  }

  async getArticleById(id: string): Promise<Article | null> {
    try {
      console.log(`📡 Fetching article by ID: ${id}`)
      
      // Try the most likely endpoint first based on the pattern you showed me
      const article = await this.apiDataSource.get<Article>(`/Articles/${id}`)
      console.log(`✅ Successfully fetched article with ID ${id} from /Articles/${id}`)
      
      return this.transformArticleItem(article)
    } catch (error) {
      console.error(`❌ Error fetching article by ID ${id}:`, error)
      return null
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      console.log(`Looking for article with slug: ${slug}`)

      // Get all articles
      const allArticles = await this.getAllArticles(1, 100)

      // Find the article item with a matching slug
      const foundArticle = allArticles.find((article) => {
        const slugToMatch = slugify(article.titleEn || "", article.id)
        const matches = slug === slugToMatch
        if (matches) {
          console.log(`Found matching article with ID: ${article.id}`)
        }
        return matches
      })

      if (foundArticle) {
        // Fetch the full article details using the ID
        return await this.getArticleById(foundArticle.id)
      }

      console.log("No matching article found for slug:", slug)
      return null
    } catch (error) {
      console.error("Error fetching article by slug:", error)
      return null
    }
  }

  async getLatestArticles(count = 3): Promise<Article[]> {
    try {
      const response = await this.apiDataSource.get<LatestArticle[]>("/Articles/last3")
      return response.map((item) => this.transformArticleItem(item))
    } catch (error) {
      console.error("Error fetching latest articles:", error)
      throw error
    }
  }

  private transformArticlesData(articles: Article[]): Article[] {
    return articles.map((item) => this.transformArticleItem(item))
  }

  private transformArticleItem(item: Article): Article {
    return {
      ...item,
      // Add full image URL if imageUrl exists
      imageUrl: item.imageUrl ? `${this.baseImageUrl}${item.imageUrl}` : null,
    }
  }
}
