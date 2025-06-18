import type { SecurityProceduresRepository } from "../domain/repositories/security-procedures-repository"
import type { SecurityProcedureStandard, SecurityProcedureSafeguard } from "../domain/models/security-procedure"

export class SecurityProceduresService {
  constructor(private repository: SecurityProceduresRepository) {}

  // Standards
  async getStandards(page = 1, pageSize = 10, search = "") {
    const response = await this.repository.getStandards(page, pageSize, search)
    return {
      standards: response.data,
      pagination: response.pagination,
    }
  }

  async getStandardById(id: string): Promise<SecurityProcedureStandard | null> {
    try {
      const response = await this.repository.getStandardById(id)
      return response.data
    } catch (error) {
      console.error("Error fetching standard:", error)
      return null
    }
  }

  // Controls
  async getControlsByStandardId(standardId: string, page = 1, pageSize = 10) {
    const response = await this.repository.getControlsByStandardId(standardId, page, pageSize)
    return {
      controls: response.data,
      pagination: response.pagination,
    }
  }

  async getControlById(id: string) {
    try {
      const response = await this.repository.getControlById(id)
      return response.data
    } catch (error) {
      console.error("Error fetching control:", error)
      return null
    }
  }

  // Safeguards
  async getSafeguardsByControlId(controlId: string) {
    const response = await this.repository.getSafeguardsByControlId(controlId)
    return {
      safeguards: response.data,
      pagination: response.pagination,
    }
  }

  async getSafeguardById(id: string): Promise<SecurityProcedureSafeguard | null> {
    try {
      const response = await this.repository.getSafeguardById(id)
      return response.data
    } catch (error) {
      console.error("Error fetching safeguard:", error)
      return null
    }
  }

  // Techniques
  async getTechniquesBySafeguardId(safeguardId: string, page = 1, pageSize = 10, search = "") {
    const response = await this.repository.getTechniquesBySafeguardId(safeguardId, page, pageSize, search)
    return {
      techniques: response.data,
      pagination: response.pagination,
    }
  }

  async getTechniqueById(id: string) {
    try {
      const response = await this.repository.getTechniqueById(id)
      return response.data
    } catch (error) {
      console.error("Error fetching technique:", error)
      return null
    }
  }

  // Implementation Steps
  async getImplementationStepsByTechniqueId(techniqueId: string) {
    const response = await this.repository.getImplementationStepsByTechniqueId(techniqueId)
    return {
      implementationSteps: response.data,
      pagination: response.pagination,
    }
  }

  async getImplementationStepById(id: string) {
    try {
      const response = await this.repository.getImplementationStepById(id)
      return response.data
    } catch (error) {
      console.error("Error fetching implementation step:", error)
      return null
    }
  }
}
