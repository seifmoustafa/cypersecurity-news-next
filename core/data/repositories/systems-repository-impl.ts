import type { SystemsRepository } from "../../domain/repositories/systems-repository"
import type { System, SystemsPaginatedResponse } from "../../domain/models/system"
import type { ApiDataSource } from "../sources/api-data-source"

export class SystemsRepositoryImpl implements SystemsRepository {
  private dataSource: ApiDataSource

  constructor(dataSource: ApiDataSource) {
    this.dataSource = dataSource
  }

  async getAllSystems(page = 1, pageSize = 10, search?: string): Promise<SystemsPaginatedResponse> {
    try {
      console.log(`🔄 SystemsRepository: Fetching systems page ${page}, pageSize ${pageSize}, search: ${search}`)

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (search && search.trim()) {
        params.append("search", search.trim())
      }

      const response = await this.dataSource.get<SystemsPaginatedResponse>(`/MainSystems?${params.toString()}`)

      // Transform image URLs to include base URL (without /api)
      const transformedData = response.data.map((system) => ({
        ...system,
        imageUrl: system.imageUrl ? `${this.dataSource.getBaseImageUrl()}${system.imageUrl}` : null,
      }))

      console.log(`✅ SystemsRepository: Successfully fetched ${transformedData.length} systems`)

      return {
        ...response,
        data: transformedData,
      }
    } catch (error) {
      console.error("❌ SystemsRepository: Error fetching systems:", error)
      throw error
    }
  }

  async getSystemById(id: string): Promise<System | null> {
    try {
      console.log(`🔄 SystemsRepository: Fetching system with ID: ${id}`)

      const system = await this.dataSource.get<System>(`/MainSystems/${id}`)

      // Transform image URL to include base URL (without /api)
      const transformedSystem = {
        ...system,
        imageUrl: system.imageUrl ? `${this.dataSource.getBaseImageUrl()}${system.imageUrl}` : null,
      }

      console.log(`✅ SystemsRepository: Successfully fetched system:`, transformedSystem.name)
      return transformedSystem
    } catch (error) {
      console.error(`❌ SystemsRepository: Error fetching system ${id}:`, error)
      return null
    }
  }

  async getPinnedSystem(): Promise<System | null> {
    try {
      console.log(`🔄 SystemsRepository: Fetching pinned system`)

      const system = await this.dataSource.get<System>(`/MainSystems/pinned`)

      // Transform image URL to include base URL (without /api)
      const transformedSystem = {
        ...system,
        imageUrl: system.imageUrl ? `${this.dataSource.getBaseImageUrl()}${system.imageUrl}` : null,
      }

      console.log(`✅ SystemsRepository: Successfully fetched pinned system:`, transformedSystem.name)
      return transformedSystem
    } catch (error) {
      console.error(`❌ SystemsRepository: Error fetching pinned system:`, error)
      // Return null for 404 (no pinned system) or other errors
      return null
    }
  }
}
