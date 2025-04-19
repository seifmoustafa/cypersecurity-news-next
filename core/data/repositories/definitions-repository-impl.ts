import type { DefinitionsRepository } from "../../domain/repositories/definitions-repository"
import type { Definition } from "../../domain/models/definition"
import type { MockDataSource } from "../sources/mock-data-source"

export class DefinitionsRepositoryImpl implements DefinitionsRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllDefinitions(): Promise<Definition[]> {
    return this.dataSource.getAllDefinitions()
  }

  async getDefinitionById(id: string): Promise<Definition | null> {
    return this.dataSource.getDefinitionById(id)
  }

  async getDefinitionsByCategory(category: string): Promise<Definition[]> {
    return this.dataSource.getDefinitionsByCategory(category)
  }

  async getCategories(): Promise<string[]> {
    return this.dataSource.getCategories()
  }
}
