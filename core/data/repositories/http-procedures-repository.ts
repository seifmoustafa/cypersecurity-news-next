import { ProceduresRepository } from "../../domain/repositories/procedures-repository"
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
} from "../../domain/models/procedure"
import { ApiDataSource } from "../sources/api-data-source"

export class HttpProceduresRepository implements ProceduresRepository {
  constructor(private apiDataSource: ApiDataSource) {}

  private transformImageUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for images and documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformDocumentUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for images and documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformImplementationStep(step: any): any {
    return {
      ...step,
      imageUrl: this.transformImageUrl(step.imageUrl),
      documentUrl: this.transformDocumentUrl(step.documentUrl),
    }
  }

  async getAllProcedures(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    forceRefresh?: boolean
  ): Promise<ProceduresPaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await this.apiDataSource.get(`/procedures?${params.toString()}`)
    return response
  }

  async getProcedureById(id: string, forceRefresh?: boolean): Promise<Procedure | null> {
    try {
      const response = await this.apiDataSource.get(`/procedures/${id}`)
      return response
    } catch (error) {
      console.error("Error fetching procedure by ID:", error)
      return null
    }
  }

  async getControlsByProcedureId(
    procedureId: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    forceRefresh?: boolean
  ): Promise<ProcedureControlsPaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await this.apiDataSource.get(
      `/ProcedureControls/byProcedure/${procedureId}?${params.toString()}`
    )
    return response
  }

  async getControlById(
    id: string,
    forceRefresh?: boolean
  ): Promise<ProcedureControl | null> {
    try {
      const response = await this.apiDataSource.get(`/ProcedureControls/${id}`)
      return response
    } catch (error) {
      console.error("Error fetching procedure control by ID:", error)
      return null
    }
  }

  async getSafeguardsByControlId(
    controlId: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    forceRefresh?: boolean
  ): Promise<ProcedureSafeguardsPaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await this.apiDataSource.get(
      `/ProcedureSafeguards/byProcedureControl/${controlId}?${params.toString()}`
    )
    return response
  }

  async getSafeguardById(
    id: string,
    forceRefresh?: boolean
  ): Promise<ProcedureSafeguard | null> {
    try {
      const response = await this.apiDataSource.get(`/ProcedureSafeguards/${id}`)
      return response
    } catch (error) {
      console.error("Error fetching procedure safeguard by ID:", error)
      return null
    }
  }

  async getTechniquesBySafeguardId(
    safeguardId: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    forceRefresh?: boolean
  ): Promise<ProcedureTechniquesPaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await this.apiDataSource.get(
      `/ProcedureTechniques/byProcedureSafeguard/${safeguardId}?${params.toString()}`
    )
    return response
  }

  async getTechniqueById(
    id: string,
    forceRefresh?: boolean
  ): Promise<ProcedureTechnique | null> {
    try {
      const response = await this.apiDataSource.get(`/ProcedureTechniques/${id}`)
      return response
    } catch (error) {
      console.error("Error fetching procedure technique by ID:", error)
      return null
    }
  }

  async getImplementationStepsByTechniqueId(
    techniqueId: string,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    forceRefresh?: boolean
  ): Promise<ProcedureImplementationStepsPaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await this.apiDataSource.get(
      `/ProcedureImplementationSteps/byProcedureTechnique/${techniqueId}?${params.toString()}`
    )
    
    // Transform the implementation steps to handle URLs properly
    return {
      ...response,
      data: response.data.map((step: any) => this.transformImplementationStep(step))
    }
  }

  async getImplementationStepById(
    id: string,
    forceRefresh?: boolean
  ): Promise<ProcedureImplementationStep | null> {
    try {
      const response = await this.apiDataSource.get(`/ProcedureImplementationSteps/${id}`)
      return this.transformImplementationStep(response)
    } catch (error) {
      console.error("Error fetching procedure implementation step by ID:", error)
      return null
    }
  }
}
