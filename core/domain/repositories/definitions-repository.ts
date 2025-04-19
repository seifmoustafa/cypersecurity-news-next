import type { Definition } from "../models/definition"

export interface DefinitionsRepository {
  getAllDefinitions(): Promise<Definition[]>
  getDefinitionById(id: string): Promise<Definition | null>
  getDefinitionsByCategory(category: string): Promise<Definition[]>
  getCategories(): Promise<string[]>
}
