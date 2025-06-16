import type { StandardsRepository } from "../../domain/repositories/standards-repository"
import type {
  Standard,
  StandardCategory,
  StandardsPaginatedResponse,
  StandardCategoriesPaginatedResponse,
  Control,
  ControlsPaginatedResponse,
  Safeguard,
  SafeguardsPaginatedResponse,
  Technique,
  TechniquesPaginatedResponse,
  ImplementationStep,
  ImplementationStepsPaginatedResponse,
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

  async getControlsByStandardId(
    standardId: string,
    page = 1,
    pageSize = 10,
    forceRefresh = false,
  ): Promise<ControlsPaginatedResponse> {
    const cacheKey = `controls-standard-${standardId}-${page}-${pageSize}`

    if (!forceRefresh) {
      const cached = this.getCachedData<ControlsPaginatedResponse>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching controls by standard: ${standardId}, page=${page}, pageSize=${pageSize}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Controls/byStandard/${standardId}?page=${page}&pageSize=${pageSize}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ControlsPaginatedResponse = await response.json()
      console.log(`✅ Fetched ${data.data.length} controls for standard ${standardId}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching controls by standard:", error)
      throw error
    }
  }

  async getControlById(controlId: string, forceRefresh = false): Promise<Control | null> {
    const cacheKey = `control-${controlId}`

    if (!forceRefresh) {
      const cached = this.getCachedData<Control>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching control by ID: ${controlId}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Controls/${controlId}`

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

      const data: Control = await response.json()
      console.log(`✅ Fetched control: ${data.nameEn}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching control:", error)
      throw error
    }
  }

  // Safeguards methods
  async getSafeguardsByControlId(
    controlId: string,
    page = 1,
    pageSize = 10,
    forceRefresh = false,
  ): Promise<SafeguardsPaginatedResponse> {
    const cacheKey = `safeguards-control-${controlId}-${page}-${pageSize}`

    if (!forceRefresh) {
      const cached = this.getCachedData<SafeguardsPaginatedResponse>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching safeguards by control: ${controlId}, page=${page}, pageSize=${pageSize}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Safeguards/by-control/${controlId}?page=${page}&pageSize=${pageSize}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SafeguardsPaginatedResponse = await response.json()
      console.log(`✅ Fetched ${data.data.length} safeguards for control ${controlId}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching safeguards by control:", error)
      throw error
    }
  }

  async getSafeguardById(safeguardId: string, forceRefresh = false): Promise<Safeguard | null> {
    const cacheKey = `safeguard-${safeguardId}`

    if (!forceRefresh) {
      const cached = this.getCachedData<Safeguard>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching safeguard by ID: ${safeguardId}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Safeguards/${safeguardId}`

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

      const data: Safeguard = await response.json()
      console.log(`✅ Fetched safeguard: ${data.nameEn}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching safeguard:", error)
      throw error
    }
  }

  // New Techniques methods
  async getTechniquesBySafeguardId(
    safeguardId: string,
    page = 1,
    pageSize = 10,
    forceRefresh = false,
  ): Promise<TechniquesPaginatedResponse> {
    const cacheKey = `techniques-safeguard-${safeguardId}-${page}-${pageSize}`

    if (!forceRefresh) {
      const cached = this.getCachedData<TechniquesPaginatedResponse>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching techniques by safeguard: ${safeguardId}, page=${page}, pageSize=${pageSize}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Techniques/by-safeguard/${safeguardId}?page=${page}&pageSize=${pageSize}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: TechniquesPaginatedResponse = await response.json()
      console.log(`✅ Fetched ${data.data.length} techniques for safeguard ${safeguardId}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching techniques by safeguard:", error)
      throw error
    }
  }

  async getTechniqueById(techniqueId: string, forceRefresh = false): Promise<Technique | null> {
    const cacheKey = `technique-${techniqueId}`

    if (!forceRefresh) {
      const cached = this.getCachedData<Technique>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching technique by ID: ${techniqueId}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/Techniques/${techniqueId}`

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

      const data: Technique = await response.json()
      console.log(`✅ Fetched technique: ${data.nameEn}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching technique:", error)
      throw error
    }
  }

  // New Implementation Steps methods
  async getImplementationStepsByTechniqueId(
    techniqueId: string,
    page = 1,
    pageSize = 10,
    forceRefresh = false,
  ): Promise<ImplementationStepsPaginatedResponse> {
    const cacheKey = `implementation-steps-technique-${techniqueId}-${page}-${pageSize}`

    if (!forceRefresh) {
      const cached = this.getCachedData<ImplementationStepsPaginatedResponse>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching implementation steps by technique: ${techniqueId}, page=${page}, pageSize=${pageSize}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/ImplementationSteps/by-technique/${techniqueId}?page=${page}&pageSize=${pageSize}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ImplementationStepsPaginatedResponse = await response.json()
      console.log(`✅ Fetched ${data.data.length} implementation steps for technique ${techniqueId}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching implementation steps by technique:", error)
      throw error
    }
  }

  async getImplementationStepById(
    implementationStepId: string,
    forceRefresh = false,
  ): Promise<ImplementationStep | null> {
    const cacheKey = `implementation-step-${implementationStepId}`

    if (!forceRefresh) {
      const cached = this.getCachedData<ImplementationStep>(cacheKey)
      if (cached) return cached
    }

    try {
      console.log(`🔄 Fetching implementation step by ID: ${implementationStepId}`)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
      const url = `${baseUrl}/ImplementationSteps/${implementationStepId}`

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

      const data: ImplementationStep = await response.json()
      console.log(`✅ Fetched implementation step: ${data.nameEn}`)

      this.setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.error("❌ Error fetching implementation step:", error)
      throw error
    }
  }

  // Legacy methods (keeping for compatibility)
  async getSafeguardsByControlIdLegacy(standardId: string, controlId: string): Promise<Safeguard[]> {
    const response = await this.getSafeguardsByControlId(controlId, 1, 100)
    return response.data
  }

  async getSafeguardByIdLegacy(standardId: string, controlId: string, safeguardId: string): Promise<Safeguard | null> {
    return this.getSafeguardById(safeguardId)
  }

  async getTechniquesBySafeguardIdLegacy(
    standardId: string,
    controlId: string,
    safeguardId: string,
  ): Promise<Technique[]> {
    const response = await this.getTechniquesBySafeguardId(safeguardId, 1, 100)
    return response.data
  }

  async getTechniqueByIdLegacy(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Technique | null> {
    return this.getTechniqueById(techniqueId)
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
