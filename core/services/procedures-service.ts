import type { ProceduresRepository } from "../domain/repositories/procedures-repository"
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
} from "../domain/models/procedure"

export class ProceduresService {
  private repository: ProceduresRepository

  constructor(repository: ProceduresRepository) {
    this.repository = repository
  }

  // Procedures
  async getAllProcedures(
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProceduresPaginatedResponse> {
    return this.repository.getAllProcedures(page, pageSize, search, forceRefresh)
  }

  async getProcedureById(id: string, forceRefresh?: boolean): Promise<Procedure | null> {
    return this.repository.getProcedureById(id, forceRefresh)
  }

  // Procedure Controls
  async getControlsByProcedureId(
    procedureId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureControlsPaginatedResponse> {
    return this.repository.getControlsByProcedureId(procedureId, page, pageSize, search, forceRefresh)
  }

  async getControlById(controlId: string, forceRefresh?: boolean): Promise<ProcedureControl | null> {
    return this.repository.getControlById(controlId, forceRefresh)
  }

  // Procedure Safeguards
  async getSafeguardsByControlId(
    controlId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureSafeguardsPaginatedResponse> {
    return this.repository.getSafeguardsByControlId(controlId, page, pageSize, search, forceRefresh)
  }

  async getSafeguardById(safeguardId: string, forceRefresh?: boolean): Promise<ProcedureSafeguard | null> {
    return this.repository.getSafeguardById(safeguardId, forceRefresh)
  }

  // Procedure Techniques
  async getTechniquesBySafeguardId(
    safeguardId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureTechniquesPaginatedResponse> {
    return this.repository.getTechniquesBySafeguardId(safeguardId, page, pageSize, search, forceRefresh)
  }

  async getTechniqueById(techniqueId: string, forceRefresh?: boolean): Promise<ProcedureTechnique | null> {
    return this.repository.getTechniqueById(techniqueId, forceRefresh)
  }

  // Procedure Implementation Steps
  async getImplementationStepsByTechniqueId(
    techniqueId: string,
    page?: number,
    pageSize?: number,
    search?: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureImplementationStepsPaginatedResponse> {
    return this.repository.getImplementationStepsByTechniqueId(techniqueId, page, pageSize, search, forceRefresh)
  }

  async getImplementationStepById(
    implementationStepId: string,
    forceRefresh?: boolean,
  ): Promise<ProcedureImplementationStep | null> {
    return this.repository.getImplementationStepById(implementationStepId, forceRefresh)
  }
}
