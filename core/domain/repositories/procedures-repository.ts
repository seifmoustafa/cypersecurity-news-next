import type {
  Procedure,
  ProceduresPaginatedResponse,
  ProcedureControl,
  ProcedureControlsPaginatedResponse,
  ProcedureSafeguard,
  ProcedureSafeguardsPaginatedResponse,
  ProcedureTechnique,
  ProcedureTechniquesPaginatedResponse,
  ProcedureImplementationStep,
  ProcedureImplementationStepsPaginatedResponse,
} from "../models/procedure"

export interface ProceduresRepository {
  // Procedures
  getAllProcedures(
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProceduresPaginatedResponse>
  getProcedureById(id: string, forceRefresh?: boolean): Promise<Procedure | null>

  // Procedure Controls
  getControlsByProcedureId(
    procedureId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureControlsPaginatedResponse>
  getControlById(controlId: string, forceRefresh?: boolean): Promise<ProcedureControl | null>

  // Procedure Safeguards
  getSafeguardsByControlId(
    controlId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureSafeguardsPaginatedResponse>
  getSafeguardById(safeguardId: string, forceRefresh?: boolean): Promise<ProcedureSafeguard | null>

  // Procedure Techniques
  getTechniquesBySafeguardId(
    safeguardId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureTechniquesPaginatedResponse>
  getTechniqueById(techniqueId: string, forceRefresh?: boolean): Promise<ProcedureTechnique | null>

  // Procedure Implementation Steps
  getImplementationStepsByTechniqueId(
    techniqueId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureImplementationStepsPaginatedResponse>
  getImplementationStepById(
    implementationStepId: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureImplementationStep | null>
}
