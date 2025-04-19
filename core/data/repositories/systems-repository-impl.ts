import type { SystemsRepository } from "../../domain/repositories/systems-repository"
import type { System } from "../../domain/models/system"
import type { MockDataSource } from "../sources/mock-data-source"

export class SystemsRepositoryImpl implements SystemsRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllSystems(): Promise<System[]> {
    return this.dataSource.getAllSystems()
  }

  async getSystemById(id: string): Promise<System | null> {
    return this.dataSource.getSystemById(id)
  }
}
