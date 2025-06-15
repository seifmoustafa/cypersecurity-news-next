import type { HelperSystemsRepository } from "../domain/repositories/helper-systems-repository"
import type { HelperSystem, HelperSystemsResponse } from "../domain/models/helper-system"

export class HelperSystemsService {
  private repository: HelperSystemsRepository

  constructor(repository: HelperSystemsRepository) {
    this.repository = repository
  }

  async getHelperSystems(page?: number, pageSize?: number, search?: string): Promise<HelperSystemsResponse> {
    console.log(
      `🔄 HelperSystemsService: Getting helper systems - page: ${page}, pageSize: ${pageSize}, search: ${search}`,
    )

    try {
      const result = await this.repository.getHelperSystems(page, pageSize, search)
      console.log(`✅ HelperSystemsService: Successfully retrieved ${result.data.length} helper systems`)
      return result
    } catch (error) {
      console.error("❌ HelperSystemsService: Error getting helper systems:", error)
      throw error
    }
  }

  async getHelperSystemById(id: string): Promise<HelperSystem | null> {
    console.log(`🔄 HelperSystemsService: Getting helper system by ID: ${id}`)

    try {
      const result = await this.repository.getHelperSystemById(id)
      console.log(`✅ HelperSystemsService: Successfully retrieved helper system`)
      return result
    } catch (error) {
      console.error("❌ HelperSystemsService: Error getting helper system by ID:", error)
      throw error
    }
  }
}
