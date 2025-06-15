import type {
  Standard,
  StandardCategory,
  StandardsPaginatedResponse,
  StandardCategoriesPaginatedResponse,
  Control,
  Safeguard,
  Technique,
  Implementation,
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
  getControlsByStandardId(standardId: string): Promise<Control[]>
  getControlById(standardId: string, controlId: string): Promise<Control | null>
  getSafeguardsByControlId(standardId: string, controlId: string): Promise<Safeguard[]>
  getSafeguardById(standardId: string, controlId: string, safeguardId: string): Promise<Safeguard | null>
  getTechniquesBySafeguardId(standardId: string, controlId: string, safeguardId: string): Promise<Technique[]>
  getTechniqueById(
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
