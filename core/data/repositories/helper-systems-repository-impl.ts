import type { HelperSystemsRepository } from "../../domain/repositories/helper-systems-repository"
import type { HelperSystem, HelperSystemsResponse } from "../../domain/models/helper-system"
import type { ApiDataSource } from "../sources/api-data-source"

export class HelperSystemsRepositoryImpl implements HelperSystemsRepository {
  private dataSource: ApiDataSource
  private baseImageUrl: string
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(dataSource: ApiDataSource) {
    this.dataSource = dataSource
    // Remove "/api" from the base URL for image and download URLs
    this.baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
  }

  async getHelperSystems(page = 1, pageSize = 10, search?: string): Promise<HelperSystemsResponse> {
    const cacheKey = `helper-systems-${page}-${pageSize}-${search || ""}`

    // Try to get from cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > Date.now()) {
      console.log(`📋 Using cached helper systems for page ${page}, search: ${search}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🔍 Fetching helper systems from API - page: ${page}, pageSize: ${pageSize}, search: ${search}`)

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<HelperSystemsResponse>(`/HelperSystems?${params.toString()}`)

      console.log(`📦 Raw API response:`, response)

      // Transform the data to include full URLs for icons and downloads
      const transformedData = {
        ...response,
        data: response.data.map((system) => ({
          ...system,
          iconUrl: system.iconUrl ? `${this.baseImageUrl}${system.iconUrl}` : system.iconUrl,
          downloadUrl: system.downloadUrl ? `${this.baseImageUrl}${system.downloadUrl}` : system.downloadUrl,
        })),
      }

      console.log(`✅ Successfully fetched ${transformedData.data.length} helper systems`)

      // Store in cache
      this.cache.set(cacheKey, transformedData)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return transformedData
    } catch (error) {
      console.error("❌ Error fetching helper systems:", error)
      throw error
    }
  }

  async getHelperSystemById(id: string): Promise<HelperSystem | null> {
    const cacheKey = `helper-system-${id}`

    // Try to get from cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > Date.now()) {
      console.log(`📋 Using cached helper system for ID: ${id}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🔍 Fetching helper system with ID: ${id}`)
      const response = await this.dataSource.get<HelperSystem>(`/HelperSystems/${id}`)

      // Transform URLs
      const transformedData = {
        ...response,
        iconUrl: response.iconUrl ? `${this.baseImageUrl}${response.iconUrl}` : response.iconUrl,
        downloadUrl: response.downloadUrl ? `${this.baseImageUrl}${response.downloadUrl}` : response.downloadUrl,
      }

      console.log(`✅ Successfully fetched helper system:`, transformedData)

      // Store in cache
      this.cache.set(cacheKey, transformedData)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return transformedData
    } catch (error) {
      console.error(`❌ Error fetching helper system with id ${id}:`, error)
      return null
    }
  }
}
