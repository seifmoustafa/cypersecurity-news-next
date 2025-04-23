import type { RegulationsRepository } from "../../domain/repositories/regulations-repository"
import type { Regulation } from "../../domain/models/regulation"
import type { MockDataSource } from "../sources/mock-data-source"

export class RegulationsRepositoryImpl implements RegulationsRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllRegulations(): Promise<Regulation[]> {
    return this.dataSource.getAllRegulations()
  }

  async getRegulationById(id: string): Promise<Regulation | null> {
    try {
      // Convert string ID to number if needed
      const numericId = Number.parseInt(id, 10)

      // Get all regulations
      const allRegulations = await this.dataSource.getAllRegulations()

      // Find the regulation with the matching ID
      const regulation = allRegulations.find((reg) => reg.id === numericId)

      return regulation || null
    } catch (error) {
      console.error(`Error fetching regulation with ID ${id}:`, error)
      return null
    }
  }
}
