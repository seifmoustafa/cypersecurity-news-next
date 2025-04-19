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
    return this.dataSource.getRegulationById(id)
  }
}
