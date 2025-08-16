import type {
  SecurityProcedureStandard,
  SecurityProcedureControl,
  SecurityProcedureSafeguard,
  SecurityProcedureTechnique,
  SecurityProcedureImplementationStep,
  PaginatedSecurityProcedureResponse,
  SingleSecurityProcedureResponse,
} from "../models/security-procedure"

export interface SecurityProceduresRepository {
  // Standards
  getStandards(
    page?: number,
    pageSize?: number,
    PageSearch?: string,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureStandard>>
  getStandardById(id: string): Promise<SingleSecurityProcedureResponse<SecurityProcedureStandard>>

  // Controls
  getControlsByStandardId(
    standardId: string,
    page?: number,
    pageSize?: number,
    PageSearch?: string,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureControl>>
  getControlById(id: string): Promise<SingleSecurityProcedureResponse<SecurityProcedureControl["control"]>>

  // Safeguards
  getSafeguardsByControlId(
    controlId: string,
    page?: number,
    pageSize?: number,
    PageSearch?: string,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureSafeguard>>
  getSafeguardById(id: string): Promise<SingleSecurityProcedureResponse<SecurityProcedureSafeguard>>

  // Techniques
  getTechniquesBySafeguardId(
    safeguardId: string,
    page?: number,
    pageSize?: number,
    PageSearch?: string,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureTechnique>>
  getTechniqueById(id: string): Promise<SingleSecurityProcedureResponse<SecurityProcedureTechnique["technique"]>>

  // Implementation Steps
  getImplementationStepsByTechniqueId(
    techniqueId: string,
    page?: number,
    pageSize?: number,
    PageSearch?: string,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureImplementationStep>>
  getImplementationStepById(
    id: string,
  ): Promise<SingleSecurityProcedureResponse<SecurityProcedureImplementationStep["implementationStep"]>>
}
