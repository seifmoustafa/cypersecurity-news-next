import type { StandardsRepository } from "../domain/repositories/standards-repository"
import type {
  Standard,
  StandardCategory,
  StandardsPaginatedResponse,
  StandardCategoriesPaginatedResponse,
  Control,
  Safeguard,
  Technique,
  Implementation,
} from "../domain/models/standard"

export class StandardsService {
  private repository: StandardsRepository

  constructor(repository: StandardsRepository) {
    this.repository = repository
  }

  // New API methods
  async getAllStandardCategories(
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<StandardCategoriesPaginatedResponse> {
    return this.repository.getAllStandardCategories(page, pageSize, forceRefresh)
  }

  async getStandardCategoryById(id: string, forceRefresh?: boolean): Promise<StandardCategory | null> {
    return this.repository.getStandardCategoryById(id, forceRefresh)
  }

  async getStandardsByCategory(
    categoryId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<StandardsPaginatedResponse> {
    return this.repository.getStandardsByCategory(categoryId, page, pageSize, forceRefresh)
  }

  async getStandardById(id: string, forceRefresh?: boolean): Promise<Standard | null> {
    return this.repository.getStandardById(id, forceRefresh)
  }

  // Legacy methods
  async getAllStandards(): Promise<Standard[]> {
    return this.repository.getAllStandards()
  }

  async getStandardCategories(): Promise<StandardCategory[]> {
    return this.repository.getStandardCategories()
  }

  async getControlsByStandardId(standardId: string): Promise<Control[]> {
    return this.repository.getControlsByStandardId(standardId)
  }

  async getControlById(standardId: string, controlId: string): Promise<Control | null> {
    return this.repository.getControlById(standardId, controlId)
  }

  async getSafeguardsByControlId(standardId: string, controlId: string): Promise<Safeguard[]> {
    return this.repository.getSafeguardsByControlId(standardId, controlId)
  }

  async getSafeguardById(standardId: string, controlId: string, safeguardId: string): Promise<Safeguard | null> {
    return this.repository.getSafeguardById(standardId, controlId, safeguardId)
  }

  async getTechniquesBySafeguardId(standardId: string, controlId: string, safeguardId: string): Promise<Technique[]> {
    return this.repository.getTechniquesBySafeguardId(standardId, controlId, safeguardId)
  }

  async getTechniqueById(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Technique | null> {
    return this.repository.getTechniqueById(standardId, controlId, safeguardId, techniqueId)
  }

  async getImplementationsByTechniqueId(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Implementation[]> {
    return this.repository.getImplementationsByTechniqueId(standardId, controlId, safeguardId, techniqueId)
  }

  async getImplementationById(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
    implementationId: string,
  ): Promise<Implementation | null> {
    return this.repository.getImplementationById(standardId, controlId, safeguardId, techniqueId, implementationId)
  }
}
