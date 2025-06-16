import type {
  Standard,
  StandardCategory,
  StandardsPaginatedResponse,
  StandardCategoriesPaginatedResponse,
  Control,
  Safeguard,
  SafeguardsPaginatedResponse,
  Technique,
  TechniquesPaginatedResponse,
  ImplementationStep,
  ImplementationStepsPaginatedResponse,
  Implementation,
  ControlsPaginatedResponse,
} from "../models/standard"

export interface StandardsRepository {
  // New API methods
  getAllStandardCategories(
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<StandardCategoriesPaginatedResponse>
  getStandardCategoryById(id: string, forceRefresh?: boolean): Promise<StandardCategory | null>
  getStandardsByCategory(
    categoryId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<StandardsPaginatedResponse>
  getStandardById(id: string, forceRefresh?: boolean): Promise<Standard | null>

  // Legacy methods for backward compatibility
  getAllStandards(): Promise<Standard[]>
  getStandardCategories(): Promise<StandardCategory[]>

  // Controls and related items
  getControlsByStandardId(
    standardId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<ControlsPaginatedResponse>
  getControlById(controlId: string, forceRefresh?: boolean): Promise<Control | null>

  // Safeguards methods
  getSafeguardsByControlId(
    controlId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<SafeguardsPaginatedResponse>
  getSafeguardById(safeguardId: string, forceRefresh?: boolean): Promise<Safeguard | null>

  // Techniques methods
  getTechniquesBySafeguardId(
    safeguardId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<TechniquesPaginatedResponse>
  getTechniqueById(techniqueId: string, forceRefresh?: boolean): Promise<Technique | null>

  // Implementation Steps methods
  getImplementationStepsByTechniqueId(
    techniqueId: string,
    page?: number,
    pageSize?: number,
    forceRefresh?: boolean,
  ): Promise<ImplementationStepsPaginatedResponse>
  getImplementationStepById(implementationStepId: string, forceRefresh?: boolean): Promise<ImplementationStep | null>

  // Legacy methods (keeping for compatibility)
  getSafeguardsByControlIdLegacy(standardId: string, controlId: string): Promise<Safeguard[]>
  getSafeguardByIdLegacy(standardId: string, controlId: string, safeguardId: string): Promise<Safeguard | null>
  getTechniquesBySafeguardIdLegacy(standardId: string, controlId: string, safeguardId: string): Promise<Technique[]>
  getTechniqueByIdLegacy(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Technique | null>

  getImplementationsByTechniqueId(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
  ): Promise<Implementation[]>
  getImplementationById(
    standardId: string,
    controlId: string,
    safeguardId: string,
    techniqueId: string,
    implementationId: string,
  ): Promise<Implementation | null>
}
