import type { DefinitionsRepository } from "../domain/repositories/definitions-repository"
import type { Definition } from "../domain/models/definition"

export class DefinitionsService {
  private repository: DefinitionsRepository

  constructor(repository: DefinitionsRepository) {
    this.repository = repository
  }

  async getAllDefinitions(): Promise<Definition[]> {
    return this.repository.getAllDefinitions()
  }

  async getDefinitionById(id: string): Promise<Definition | null> {
    return this.repository.getDefinitionById(id)
  }

  async getDefinitionsByCategory(category: string): Promise<Definition[]> {
    return this.repository.getDefinitionsByCategory(category)
  }

  async getCategories(): Promise<string[]> {
    return this.repository.getCategories()
  }
}
