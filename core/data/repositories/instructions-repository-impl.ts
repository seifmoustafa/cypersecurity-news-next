import type { InstructionsRepository } from "../../domain/repositories/instructions-repository"
import type { Instruction, InstructionsPaginatedResponse } from "../../domain/models/instruction"
import type { ApiDataSource } from "../sources/api-data-source"

export class InstructionsRepositoryImpl implements InstructionsRepository {
  private dataSource: ApiDataSource
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 2 * 60 * 1000 // Reduced to 2 minutes for more frequent updates

  constructor(dataSource: ApiDataSource) {
    this.dataSource = dataSource
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T
    }
    this.cache.delete(key)
    return null
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  // Add method to clear specific cache entries
  private clearRelatedCache(instructionId?: string): void {
    if (instructionId) {
      // Clear specific instruction cache
      this.cache.delete(`instruction-${instructionId}`)
    }

    // Clear list caches that might contain this instruction
    const keysToDelete: string[] = []
    for (const [key] of this.cache) {
      if (
        key.startsWith("instructions-by-year-id-") ||
        key.startsWith("instructions-by-type-") ||
        key.startsWith("instructions-by-year-") ||
        key === "all-instructions"
      ) {
        keysToDelete.push(key)
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key))
  }

  // Add method to force refresh cache
  public clearCache(): void {
    this.cache.clear()
  }

  private transformImageUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for images and documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformDocumentUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for images and documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformInstruction(instruction: any): Instruction {
    return {
      ...instruction,
      imageUrl: this.transformImageUrl(instruction.imageUrl),
      documentUrl: this.transformDocumentUrl(instruction.documentUrl),
    }
  }

  async getAllInstructions(): Promise<Instruction[]> {
    const cacheKey = "all-instructions"
    const cached = this.getCachedData<Instruction[]>(cacheKey)
    if (cached) return cached

    try {
      console.log("Fetching all instructions from API")
      const response = await this.dataSource.get("/advanced/instructions")
      const instructions = response.data?.map((instruction: any) => this.transformInstruction(instruction)) || []
      this.setCachedData(cacheKey, instructions)
      return instructions
    } catch (error) {
      console.error("Error fetching all instructions:", error)
      throw error
    }
  }

  async getInstructionsByType(type: "group" | "branch"): Promise<Instruction[]> {
    const cacheKey = `instructions-by-type-${type}`
    const cached = this.getCachedData<Instruction[]>(cacheKey)
    if (cached) return cached

    try {
      console.log(`Fetching instructions by type: ${type}`)
      const response = await this.dataSource.get(`/advanced/instructions/byType/${type}`)
      const instructions = response.data?.map((instruction: any) => this.transformInstruction(instruction)) || []
      this.setCachedData(cacheKey, instructions)
      return instructions
    } catch (error) {
      console.error(`Error fetching instructions by type ${type}:`, error)
      throw error
    }
  }

  async getInstructionsByYear(year: string): Promise<Instruction[]> {
    const cacheKey = `instructions-by-year-${year}`
    const cached = this.getCachedData<Instruction[]>(cacheKey)
    if (cached) return cached

    try {
      console.log(`Fetching instructions by year: ${year}`)
      const response = await this.dataSource.get(`/advanced/instructions/byYear/${year}`)
      const instructions = response.data?.map((instruction: any) => this.transformInstruction(instruction)) || []
      this.setCachedData(cacheKey, instructions)
      return instructions
    } catch (error) {
      console.error(`Error fetching instructions by year ${year}:`, error)
      throw error
    }
  }

  async getInstructionsByTypeAndYear(type: "group" | "branch", year: string): Promise<Instruction | null> {
    const cacheKey = `instruction-by-type-year-${type}-${year}`
    const cached = this.getCachedData<Instruction>(cacheKey)
    if (cached) return cached

    try {
      console.log(`Fetching instruction by type: ${type} and year: ${year}`)
      const response = await this.dataSource.get(`/advanced/instructions/byTypeAndYear/${type}/${year}`)
      const instruction = response ? this.transformInstruction(response) : null
      this.setCachedData(cacheKey, instruction)
      return instruction
    } catch (error) {
      console.error(`Error fetching instruction by type ${type} and year ${year}:`, error)
      throw error
    }
  }

  async getYearsByType(type: "group" | "branch"): Promise<string[]> {
    const cacheKey = `years-by-type-${type}`
    const cached = this.getCachedData<string[]>(cacheKey)
    if (cached) return cached

    try {
      console.log(`Fetching years by type: ${type}`)
      const response = await this.dataSource.get(`/advanced/instructions/yearsByType/${type}`)
      const years = response.data || []
      this.setCachedData(cacheKey, years)
      return years
    } catch (error) {
      console.error(`Error fetching years by type ${type}:`, error)
      throw error
    }
  }

  async getInstructionsByYearId(yearId: string, page = 1, pageSize = 10): Promise<InstructionsPaginatedResponse> {
    const cacheKey = `instructions-by-year-id-${yearId}-${page}-${pageSize}`
    const cached = this.getCachedData<InstructionsPaginatedResponse>(cacheKey)
    if (cached) return cached

    try {
      console.log(`Fetching instructions by yearId: ${yearId}, page: ${page}, pageSize: ${pageSize}`)
      const url = `/advanced/instructions/byYear/${yearId}?page=${page}&pageSize=${pageSize}`
      console.log(`API URL: ${url}`)

      const response = await this.dataSource.get(url)
      console.log("Raw API response:", response)

      const result: InstructionsPaginatedResponse = {
        data: response.data?.map((instruction: any) => this.transformInstruction(instruction)) || [],
        pagination: response.pagination || {
          itemsCount: 0,
          pagesCount: 0,
          pageSize: pageSize,
          currentPage: page,
        },
      }

      console.log("Transformed result:", result)
      this.setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.error(`Error fetching instructions by yearId ${yearId}:`, error)
      throw error
    }
  }

  async getInstructionById(id: string, forceRefresh = false): Promise<Instruction | null> {
    const cacheKey = `instruction-${id}`

    // Skip cache if force refresh is requested
    if (!forceRefresh) {
      const cached = this.getCachedData<Instruction>(cacheKey)
      if (cached) {
        console.log(`📋 Using cached instruction for ID: ${id}`)
        return cached
      }
    }

    try {
      console.log(`🔄 Fetching fresh instruction by ID: ${id}`)
      const response = await this.dataSource.get(`/advanced/instructions/${id}`)
      const instruction = response ? this.transformInstruction(response) : null

      if (instruction) {
        this.setCachedData(cacheKey, instruction)
        console.log(`✅ Fresh instruction loaded and cached: ${instruction.titleEn || instruction.title}`)
      }

      return instruction
    } catch (error) {
      console.error(`Error fetching instruction by ID ${id}:`, error)
      throw error
    }
  }
}
