import type { InstructionCategory, InstructionCategoriesResponse } from "../../domain/models/instruction-category"
import type { InstructionCategoriesRepository } from "../../domain/repositories/instruction-categories-repository"
import type { ApiDataSource } from "../sources/api-data-source"
import { slugify } from "../../../lib/utils"

export class InstructionCategoriesRepositoryImpl implements InstructionCategoriesRepository {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTTL = 5 * 60 * 1000 // 5 minutes

  constructor(private apiDataSource: ApiDataSource) {}

  async getAllCategories(page = 1, pageSize = 50): Promise<InstructionCategoriesResponse> {
    const cacheKey = `instruction-categories-${page}-${pageSize}`
    const cachedData = this.cache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTTL) {
      console.log(`📋 Using cached instruction categories for page ${page}`)
      return cachedData.data
    }

    try {
      console.log(`🔍 Fetching instruction categories for page ${page}`)
      const response = await this.apiDataSource.get<InstructionCategoriesResponse>(
        `/instruction-categories?page=${page}&pageSize=${pageSize}`,
      )

      this.cache.set(cacheKey, { data: response, timestamp: Date.now() })
      return response
    } catch (error) {
      console.error("Error fetching instruction categories:", error)
      throw error
    }
  }

  async getCategoryById(id: string): Promise<InstructionCategory | null> {
    const cacheKey = `instruction-category-${id}`
    const cachedData = this.cache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTTL) {
      return cachedData.data
    }

    try {
      const response = await this.apiDataSource.get<InstructionCategory>(`/instruction-categories/${id}`)
      this.cache.set(cacheKey, { data: response, timestamp: Date.now() })
      return response
    } catch (error) {
      console.error(`Error fetching instruction category with id ${id}:`, error)
      return null
    }
  }

  async getCategoryBySlug(slug: string): Promise<InstructionCategory | null> {
    try {
      console.log(`🔍 Finding instruction category by slug: ${slug}`)
      // Get all categories first
      const allCategories = await this.getAllCategories(1, 100)

      // Find the category with matching slug
      const category = allCategories.data.find((cat) => {
        const slugEn = slugify(cat.nameEn || "", cat.id)
        const slugLc = slug?.toLowerCase() ?? ""
        return slugEn === slug || slugEn.toLowerCase() === slugLc
      })

      if (category) {
        console.log(`✅ Found category for slug ${slug}:`, category)
        return category
      }

      console.log(`❌ No category found for slug ${slug}`)
      return null
    } catch (error) {
      console.error(`Error finding instruction category by slug ${slug}:`, error)
      return null
    }
  }
}
