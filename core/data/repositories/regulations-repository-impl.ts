import type { RegulationsRepository } from "../../domain/repositories/regulations-repository"
import type { Regulation, RegulationsResponse } from "../../domain/models/regulation"
import type { ApiDataSource } from "../sources/api-data-source"
import { slugify } from "@/lib/utils"

export class RegulationsRepositoryImpl implements RegulationsRepository {
  private dataSource: ApiDataSource
  private baseImageUrl: string
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(dataSource: ApiDataSource) {
    this.dataSource = dataSource
    // Remove "/api" from the base URL for image and document URLs
    this.baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
  }

  private transformRegulation(regulation: Regulation): Regulation {
    return {
      ...regulation,
      imageUrl: regulation.imageUrl ? `${this.baseImageUrl}${regulation.imageUrl}` : regulation.imageUrl,
      documentUrl: regulation.documentUrl ? `${this.baseImageUrl}${regulation.documentUrl}` : regulation.documentUrl,
    }
  }

  private transformRegulationsResponse(response: RegulationsResponse): RegulationsResponse {
    return {
      ...response,
      data: response.data.map(this.transformRegulation.bind(this)),
    }
  }

  async getAllRegulations(page = 1, pageSize = 10): Promise<RegulationsResponse> {
    const cacheKey = `regulations-all-${page}-${pageSize}`

    // Try to get from cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > Date.now()) {
      console.log(`📋 Using cached regulations for page ${page}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`📡 Fetching regulations from API for page ${page}`)
      const response = await this.dataSource.get<RegulationsResponse>(`/Regulations?page=${page}&pageSize=${pageSize}`)

      const transformedResponse = this.transformRegulationsResponse(response)

      // Store in cache
      this.cache.set(cacheKey, transformedResponse)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return transformedResponse
    } catch (error) {
      console.error("❌ Error fetching regulations:", error)
      throw error
    }
  }

  async getRegulationsByCategory(categoryId: string, page = 1, pageSize = 10): Promise<RegulationsResponse> {
    const cacheKey = `regulations-category-${categoryId}-${page}-${pageSize}`

    // Try to get from cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > Date.now()) {
      console.log(`📋 Using cached regulations for category ${categoryId} page ${page}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`📡 Fetching regulations from API for category ${categoryId} page ${page}`)
      const response = await this.dataSource.get<RegulationsResponse>(
        `/Regulations/byCategory/${categoryId}?page=${page}&pageSize=${pageSize}`,
      )

      const transformedResponse = this.transformRegulationsResponse(response)

      // Store in cache
      this.cache.set(cacheKey, transformedResponse)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return transformedResponse
    } catch (error) {
      console.error(`❌ Error fetching regulations for category ${categoryId}:`, error)
      throw error
    }
  }

  async getRegulationById(id: string): Promise<Regulation | null> {
    const cacheKey = `regulation-${id}`

    // Try to get from cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > Date.now()) {
      console.log(`📋 Using cached regulation for ID ${id}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`📡 Fetching regulation from API for ID ${id}`)
      const response = await this.dataSource.get<Regulation>(`/Regulations/${id}`)

      const transformedRegulation = this.transformRegulation(response)

      // Store in cache
      this.cache.set(cacheKey, transformedRegulation)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return transformedRegulation
    } catch (error) {
      console.error(`❌ Error fetching regulation with ID ${id}:`, error)
      return null
    }
  }

  async getRegulationBySlug(slug: string): Promise<Regulation | null> {
    try {
      // Get all regulations first (with a larger page size to increase chances of finding the right one)
      const allRegulations = await this.getAllRegulations(1, 100)

      // Find the regulation with matching slug (based on English or Arabic title or ID)
      const regulation = allRegulations.data.find((reg) => {
        const slugEn = slugify(reg.titleEn || "", reg.id)
        const slugAr = slugify(reg.title || "", reg.id)
        return slugEn === slug || slugAr === slug
      })

      return regulation || null
    } catch (error) {
      console.error(`❌ Error fetching regulation with slug ${slug}:`, error)
      return null
    }
  }
}
