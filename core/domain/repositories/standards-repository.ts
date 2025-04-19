import type { Standard, StandardCategory, Control, Safeguard, Technique, Implementation } from "../models/standard"

export interface StandardsRepository {
  getAllStandards(): Promise<Standard[]>
  getStandardById(id: string): Promise<Standard | null>
  getStandardsByCategory(category: string): Promise<Standard[]>
  getStandardCategories(): Promise<StandardCategory[]>
  getStandardCategoryById(id: string): Promise<StandardCategory | null>

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
