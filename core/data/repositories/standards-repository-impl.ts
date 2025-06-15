import type { StandardsRepository } from "../../domain/repositories/standards-repository"
import type {
  Standard,
  StandardCategory,
  StandardsPaginatedResponse,
  StandardCategoriesPaginatedResponse,
  Control,
  Safeguard,
  Technique,
  Implementation,
} from "../../domain/models/standard"
import type { MockDataSource } from "../sources/mock-data-source"

export class StandardsRepositoryImpl implements StandardsRepository {
  private dataSource: MockDataSource
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 2 * 60 * 1000 // 2 minutes

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log(`🎯 Cache hit for: ${key}`)
      return cached.data as T
    }
    if (cached) {
      console.log(`⏰ Cache expired for: ${key}`)
      this.cache.delete(key)
    }
    return null
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() })
    console.log(`💾 Cached data for: ${key}`)
  }

  async getAllStandardCategories(
    page = 1,
    pageSize = 10,
    forceRefresh = false,
  ): Promise<StandardCategoriesPaginatedResponse> {
    const cacheKey = `standard-categories-${page}-${pageSize}`

    if (!forceRefresh) {
      const cached = this.getCachedData<StandardCategoriesPaginatedResponse>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching standard categories from API: page=${page}, pageSize=${pageSize}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/StandardCategories?page=${page}&pageSize=${pageSize}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: StandardCategoriesPaginatedResponse = await response.json()
      console.log(`✅ Fetched ${data.data.length} standard categories`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching standard categories:", error)
      throw error
    }
  }

  async getStandardCategoryById(id: string, forceRefresh = false): Promise<StandardCategory | null> {
    const cacheKey = `standard-category-${id}`

    if (!forceRefresh) {
      const cached = this.getCachedData<StandardCategory>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching standard category by ID: ${id}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/StandardCategories/${id}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: StandardCategory = await response.json()
      console.log(`✅ Fetched standard category: ${data.nameEn}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching standard category:", error)
      throw error
    }
  }

  async getStandardsByCategory(
    categoryId: string,
    page = 1,
    pageSize = 10,
    forceRefresh = false,
  ): Promise<StandardsPaginatedResponse> {
    const cacheKey = `standards-category-${categoryId}-${page}-${pageSize}`

    if (!forceRefresh) {
      const cached = this.getCachedData<StandardsPaginatedResponse>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching standards by category: ${categoryId}, page=${page}, pageSize=${pageSize}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Standards/byCategory/${categoryId}?page=${page}&pageSize=${pageSize}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: StandardsPaginatedResponse = await response.json()
      console.log(`✅ Fetched ${data.data.length} standards for category ${categoryId}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching standards by category:", error)
      throw error
    }
  }

  async getStandardById(id: string, forceRefresh = false): Promise<Standard | null> {
    const cacheKey = `standard-${id}`

    if (!forceRefresh) {
      const cached = this.getCachedData<Standard>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching standard by ID: ${id}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Standards/${id}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Standard = await response.json()
      console.log(`✅ Fetched standard: ${data.nameEn}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching standard:", error)
      throw error
    }
  }

  // Legacy methods for backward compatibility
  async getAllStandards(): Promise<Standard[]> {
    const response = await this.getAllStandardCategories(1, 100)
    const allStandards: Standard[] = []

    for (const category of response.data) {
      const standards = await this.getStandardsByCategory(category.id, 1, 100)
      allStandards.push(...standards.data)
    }

    return allStandards
  }

  async getStandardCategories(): Promise<StandardCategory[]> {
    const response = await this.getAllStandardCategories(1, 100)
    return response.data
  }

  async getControlsByStandardId(standardId: string): Promise<Control[]> {
    // Mock implementation - would be replaced with real API call
    return []
  }

  async getControlById(standardId: string, controlId: string): Promise<Control | null> {
    // Mock implementation - would be replaced with real API call
    return null
  }

  async getSafeguardsByControlId(standardId: string, controlId: string): Promise<Safeguard[]> {
    // Mock implementation - would be replaced with real API call
    return []
  }

  async getSafeguardById(standardId: string, controlId: string, safeguardId: string): Promise<Safeguard | null> {
    // Mock implementation - would be replaced with real API call
    return null
  }

  async getTechniquesBySafeguardId(standardId: string, controlId: string, safeguardId: string): Promise<Technique[]> {
    // Mock implementation - would be replaced with real API call
    return []
  }

  async getTechniqueById(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Technique | null> {
    // Mock implementation - would be replaced with real API call
    return null
  }

  async getImplementationsByTechniqueId(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Implementation[]> {
    // Mock implementation - would be replaced with real API call
    return []
  }

  async getImplementationById(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
    implementationId: string,
  ): Promise<Implementation | null> {
    // Mock implementation - would be replaced with real API call
    return null
  }
}
