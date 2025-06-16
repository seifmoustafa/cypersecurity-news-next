import type { StandardsRepository } from "../domain/repositories/standards-repository"
import type {
  Standard,
  StandardCategory,
  StandardsPaginatedResponse,
  StandardCategoriesPaginatedResponse,
  Control,
  ControlsPaginatedResponse,
  Safeguard,
  SafeguardsPaginatedResponse,
  Technique,
  TechniquesPaginatedResponse,
  ImplementationStep,
  ImplementationStepsPaginatedResponse,
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

  async getControlsByStandardId(
    standardId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<ControlsPaginatedResponse> {
    return this.repository.getControlsByStandardId(standardId, page, pageSize, forceRefresh)
  }

  async getControlById(controlId: string, forceRefresh?: boolean): Promise<Control | null> {
    return this.repository.getControlById(controlId, forceRefresh)
  }

  // Safeguards methods
  async getSafeguardsByControlId(
    controlId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<SafeguardsPaginatedResponse> {
    return this.repository.getSafeguardsByControlId(controlId, page, pageSize, forceRefresh)
  }

  async getSafeguardById(safeguardId: string, forceRefresh?: boolean): Promise<Safeguard | null> {
    return this.repository.getSafeguardById(safeguardId, forceRefresh)
  }

  // New Techniques methods
  async getTechniquesBySafeguardId(
    safeguardId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<TechniquesPaginatedResponse> {
    return this.repository.getTechniquesBySafeguardId(safeguardId, page, pageSize, forceRefresh)
  }

  async getTechniqueById(techniqueId: string, forceRefresh?: boolean): Promise<Technique | null> {
    return this.repository.getTechniqueById(techniqueId, forceRefresh)
  }

  // New Implementation Steps methods
  async getImplementationStepsByTechniqueId(
    techniqueId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<ImplementationStepsPaginatedResponse> {
    return this.repository.getImplementationStepsByTechniqueId(techniqueId, page, pageSize, forceRefresh)
  }

  async getImplementationStepById(
    implementationStepId: string,
    forceRefresh?: boolean,
  ): Promise<ImplementationStep | null> {
    return this.repository.getImplementationStepById(implementationStepId, forceRefresh)
  }

  // Legacy methods
  async getSafeguardsByControlIdLegacy(standardId: string, controlId: string): Promise<Safeguard[]> {
    return this.repository.getSafeguardsByControlIdLegacy(standardId, controlId)
  }

  async getSafeguardByIdLegacy(standardId: string, controlId: string, safeguardId: string): Promise<Safeguard | null> {
    return this.repository.getSafeguardByIdLegacy(standardId, controlId, safeguardId)
  }

  async getTechniquesBySafeguardIdLegacy(
    standardId: string,
    controlId: string,
    safeguardId: string,
  ): Promise<Technique[]> {
    return this.repository.getTechniquesBySafeguardIdLegacy(standardId, controlId, safeguardId)
  }

  async getTechniqueByIdLegacy(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Technique | null> {
    return this.repository.getTechniqueByIdLegacy(standardId, controlId, safeguardId, techniqueId)
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
