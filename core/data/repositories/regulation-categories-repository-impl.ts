import type { RegulationCategoriesRepository } from "../../domain/repositories/regulation-categories-repository"
import type { RegulationCategory, RegulationCategoriesResponse } from "../../domain/models/regulation-category"
import type { ApiDataSource } from "../sources/api-data-source"
import { slugify } from "@/lib/utils"

export class RegulationCategoriesRepositoryImpl implements RegulationCategoriesRepository {
  private dataSource: ApiDataSource
  private baseImageUrl: string
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(dataSource: ApiDataSource) {
    this.dataSource = dataSource
    // Remove "/api" from the base URL for image URLs
    this.baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
  }

  async getAllCategories(page = 1, pageSize = 100): Promise<RegulationCategoriesResponse> {
    const cacheKey = `regulation-categories-${page}-${pageSize}`

    // Try to get from cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > Date.now()) {
      console.log(`📋 Using cached regulation categories for page ${page}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`📡 Fetching regulation categories from API for page ${page}`)
      const response = await this.dataSource.get<RegulationCategoriesResponse>(
        `/RegulationCategories?page=${page}&pageSize=${pageSize}`,
      )

      // Store in cache
      this.cache.set(cacheKey, response)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return response
    } catch (error) {
      console.error("❌ Error fetching regulation categories:", error)
      throw error
    }
  }

  async getCategoryById(id: string): Promise<RegulationCategory | null> {
    const cacheKey = `regulation-category-${id}`

    // Try to get from cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > Date.now()) {
      console.log(`📋 Using cached regulation category for ID ${id}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`📡 Fetching regulation category from API for ID ${id}`)
      const response = await this.dataSource.get<RegulationCategory>(`/RegulationCategories/${id}`)

      // Store in cache
      this.cache.set(cacheKey, response)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return response
    } catch (error) {
      console.error(`❌ Error fetching regulation category with ID ${id}:`, error)
      return null
    }
  }

  async getCategoryBySlug(slug: string): Promise<RegulationCategory | null> {
    try {
      console.log(`🔍 Looking for regulation category with slug ${slug}`)

      // Get all categories first (with a large pageSize to ensure we get all)
      const allCategories = await this.getAllCategories(1, 100)

      // Find the category with matching slug (based on English or Arabic name or ID)
      const category = allCategories.data.find((cat) => {
        const slugEn = slugify(cat.name_En || "", cat.id)
        const slugAr = slugify(cat.name || "", cat.id)
        const slugLc = slug?.toLowerCase() ?? ""
        return slugEn === slug || slugEn.toLowerCase() === slugLc || slugAr === slug
      })

      console.log(`🔍 Category search result:`, category ? `Found: ${category.name_En}` : "Not found")

      return category || null
    } catch (error) {
      console.error(`❌ Error fetching regulation category with slug ${slug}:`, error)
      return null
    }
  }
}
