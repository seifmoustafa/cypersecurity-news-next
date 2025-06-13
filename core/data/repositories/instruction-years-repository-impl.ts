import type { InstructionYear, InstructionYearsResponse } from "../../domain/models/instruction-year"
import type { InstructionYearsRepository } from "../../domain/repositories/instruction-years-repository"
import type { ApiDataSource } from "../sources/api-data-source"

export class InstructionYearsRepositoryImpl implements InstructionYearsRepository {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheTTL = 5 * 60 * 1000 // 5 minutes

  constructor(private apiDataSource: ApiDataSource) {}

  async getYearsByCategory(categoryId: string, page = 1, pageSize = 50): Promise<InstructionYearsResponse> {
    if (!categoryId) {
      return { data: [], pagination: { itemsCount: 0, pagesCount: 0, pageSize, currentPage: page } }
    }

    const cacheKey = `instruction-years-category-${categoryId}-${page}-${pageSize}`
    const cachedData = this.cache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTTL) {
      console.log(`📋 Using cached instruction years for category ${categoryId}`)
      return cachedData.data
    }

    try {
      console.log(`🔍 Fetching instruction years for category ${categoryId}`)
      const response = await this.apiDataSource.get<InstructionYearsResponse>(
        `/instruction-years/by-category/${categoryId}?page=${page}&pageSize=${pageSize}`,
      )

      this.cache.set(cacheKey, { data: response, timestamp: Date.now() })
      return response
    } catch (error) {
      console.error(`Error fetching instruction years for category ${categoryId}:`, error)
      throw error
    }
  }

  async getYearById(id: string): Promise<InstructionYear | null> {
    const cacheKey = `instruction-year-${id}`
    const cachedData = this.cache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTTL) {
      return cachedData.data
    }

    try {
      const response = await this.apiDataSource.get<InstructionYear>(`/instruction-years/${id}`)
      this.cache.set(cacheKey, { data: response, timestamp: Date.now() })
      return response
    } catch (error) {
      console.error(`Error fetching instruction year with id ${id}:`, error)
      return null
    }
  }

  async getYearByCategoryAndYear(categoryId: string, year: number): Promise<InstructionYear | null> {
    try {
      console.log(`🔍 Finding instruction year by category ${categoryId} and year ${year}`)
      // Get all years for this category
      const allYears = await this.getYearsByCategory(categoryId, 1, 100)

      // Find the year with matching year number
      const yearItem = allYears.data.find((y) => y.year === year)

      if (yearItem) {
        console.log(`✅ Found year ${year} for category ${categoryId}:`, yearItem)
        return yearItem
      }

      console.log(`❌ No year ${year} found for category ${categoryId}`)
      return null
    } catch (error) {
      console.error(`Error finding instruction year by category ${categoryId} and year ${year}:`, error)
      return null
    }
  }
}
