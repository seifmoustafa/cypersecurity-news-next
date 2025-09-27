import type { DefinitionsRepository } from "../domain/repositories/definitions-repository";
import type {
  Definition,
  DefinitionCategory,
  DefinitionsPaginatedResponse,
  DefinitionCategoriesPaginatedResponse,
} from "../domain/models/definition";

export class DefinitionsService {
  private repository: DefinitionsRepository;

  constructor(repository: DefinitionsRepository) {
    this.repository = repository;
  }

  async getAllDefinitions(): Promise<Definition[]> {
    return this.repository.getAllDefinitions();
  }

  async getDefinitionById(id: string): Promise<Definition | null> {
    return this.repository.getDefinitionById(id);
  }

  async getDefinitionsByCategory(
    categoryId: string,
    page = 1,
    pageSize = 10,
    search?: string
  ): Promise<DefinitionsPaginatedResponse> {
    return this.repository.getDefinitionsByCategory(categoryId, page, pageSize, search);
  }

  async getCategories(): Promise<string[]> {
    return this.repository.getCategories();
  }

  async getAllCategories(
    page = 1,
    pageSize = 10,
    search?: string
  ): Promise<DefinitionCategoriesPaginatedResponse> {
    return this.repository.getAllCategories(page, pageSize, search);
  }

  async getCategoryById(id: string): Promise<DefinitionCategory | null> {
    return this.repository.getCategoryById(id);
  }

  async getDefinitionBySlug(slug: string): Promise<Definition | null> {
    return this.repository.getDefinitionBySlug(slug);
  }

  async getCategoryBySlug(slug: string): Promise<DefinitionCategory | null> {
    return this.repository.getCategoryBySlug(slug);
  }
}
