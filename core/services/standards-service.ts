import type { StandardsRepository } from "../domain/repositories/standards-repository"
import type {
  Standard,
  StandardCategory,
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

  async getAllStandards(): Promise<Standard[]> {
    return this.repository.getAllStandards()
  }

  async getStandardById(id: string): Promise<Standard | null> {
    return this.repository.getStandardById(id)
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    return this.repository.getStandardsByCategory(category)
  }

  async getStandardCategories(): Promise<StandardCategory[]> {
    return this.repository.getStandardCategories()
  }

  async getStandardCategoryById(id: string): Promise<StandardCategory | null> {
    return this.repository.getStandardCategoryById(id)
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
