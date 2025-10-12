import type {
  Definition,
  DefinitionCategory,
  DefinitionsPaginatedResponse,
  DefinitionCategoriesPaginatedResponse,
} from "../models/definition"

export interface DefinitionsRepository {
  getAllDefinitions(): Promise<Definition[]>
  getDefinitionById(id: string): Promise<Definition | null>
  getDefinitionsByCategory(categoryId: string, page?: number, pageSize?: number, search?: string): Promise<DefinitionsPaginatedResponse>
  getDefinitionsByCategoryForProfessionals(categoryId: string, page?: number, pageSize?: number, search?: string): Promise<DefinitionsPaginatedResponse>
  getCategories(): Promise<string[]>
  getAllCategories(page?: number, pageSize?: number, search?: string): Promise<DefinitionCategoriesPaginatedResponse>
  getAllCategoriesForProfessionals(page?: number, pageSize?: number, search?: string): Promise<DefinitionCategoriesPaginatedResponse>
  getCategoryById(id: string): Promise<DefinitionCategory | null>
  getDefinitionBySlug(slug: string): Promise<Definition | null>
  getCategoryBySlug(slug: string): Promise<DefinitionCategory | null>
}