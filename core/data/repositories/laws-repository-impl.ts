import type { LawsRepository } from "../../domain/repositories/laws-repository"
import type { Law, LawsPaginatedResponse } from "../../domain/models/law"
import type { LawCategory, LawCategoriesPaginatedResponse } from "../../domain/models/law-category"
import type { ApiDataSource } from "../sources/api-data-source"
import { slugify } from "../../../lib/utils"

export class LawsRepositoryImpl implements LawsRepository {
  private apiDataSource: ApiDataSource
  private baseDocumentUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  constructor(apiDataSource: ApiDataSource) {
    this.apiDataSource = apiDataSource
  }

  async getAllCategories(page = 1, pageSize = 10): Promise<LawCategoriesPaginatedResponse> {
    return await this.apiDataSource.get<LawCategoriesPaginatedResponse>(
      `/LawCategories?page=${page}&pageSize=${pageSize}`,
    )
  }

  async getCategoryById(id: string): Promise<LawCategory> {
    return await this.apiDataSource.get<LawCategory>(`/LawCategories/${id}`)
  }

  async getLawsByCategory(categoryId: string, page = 1, pageSize = 10): Promise<LawsPaginatedResponse> {
    const response = await this.apiDataSource.get<LawsPaginatedResponse>(
      `/Laws/byCategory/${categoryId}?page=${page}&pageSize=${pageSize}`,
    )

    // Transform document URLs to include base URL
    const transformedData = response.data.map((law) => ({
      ...law,
      documentUrl: law.documentUrl ? `${this.baseDocumentUrl}${law.documentUrl}` : "",
    }))

    return {
      ...response,
      data: transformedData,
    }
  }

  async getLawById(id: string): Promise<Law> {
    const law = await this.apiDataSource.get<Law>(`/Laws/${id}`)

    // Transform document URL to include base URL
    return {
      ...law,
      documentUrl: law.documentUrl ? `${this.baseDocumentUrl}${law.documentUrl}` : "",
    }
  }

  async getCategoryBySlug(slug: string): Promise<LawCategory | null> {
    try {
      const response = await this.getAllCategories(1, 100) // Get all categories
      const category = response.data.find((cat) => {
        const englishName = cat.nameEn || cat.name || ""
        const categorySlug = slugify(englishName)
        return categorySlug === slug
      })
      return category || null
    } catch (error) {
      console.error("Error finding category by slug:", error)
      return null
    }
  }

  async getLawBySlug(slug: string): Promise<Law | null> {
    try {
      // We need to get all laws to find by slug - this could be optimized with a search endpoint
      const categories = await this.getAllCategories(1, 100)

      for (const category of categories.data) {
        const laws = await this.getLawsByCategory(category.id, 1, 100)
        const law = laws.data.find((law) => {
          const englishTitle = law.titleEn || law.title || ""
          const lawSlug = slugify(englishTitle)
          return lawSlug === slug
        })
        if (law) return law
      }

      return null
    } catch (error) {
      console.error("Error finding law by slug:", error)
      return null
    }
  }
}
