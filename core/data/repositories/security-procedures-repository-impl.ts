import type { SecurityProceduresApiDataSource } from "../sources/security-procedures-api-data-source"
import type { SecurityProceduresRepository } from "../../domain/repositories/security-procedures-repository"
import type {
  SecurityProcedureStandard,
  SecurityProcedureControl,
  SecurityProcedureSafeguard,
  SecurityProcedureTechnique,
  SecurityProcedureImplementationStep,
  PaginatedSecurityProcedureResponse,
  SingleSecurityProcedureResponse,
} from "../../domain/models/security-procedure"

export class SecurityProceduresRepositoryImpl implements SecurityProceduresRepository {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(private apiDataSource: SecurityProceduresApiDataSource) {}

  private getCacheKey(method: string, params: any): string {
    return `${method}_${JSON.stringify(params)}`
  }

  private isValidCache(cacheEntry: { data: any; timestamp: number }): boolean {
    return Date.now() - cacheEntry.timestamp < this.CACHE_TTL
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  // Standards
  async getStandards(
    page = 1,
    pageSize = 10,
    search = "",
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureStandard>> {
    const cacheKey = this.getCacheKey("getStandards", { page, pageSize, search })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const params = new URLSearchParams({
      PageNumber: page.toString(),
      PageSize: pageSize.toString(),
    })

    if (search) {
      params.append("PageSearch", search)
    }

    const response = await this.apiDataSource.get<PaginatedSecurityProcedureResponse<SecurityProcedureStandard>>(
      `/WebSite/Standards?${params.toString()}`,
    )

    this.setCache(cacheKey, response)
    return response
  }

  async getStandardById(id: string): Promise<SingleSecurityProcedureResponse<SecurityProcedureStandard>> {
    const cacheKey = this.getCacheKey("getStandardById", { id })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const response = await this.apiDataSource.get<SingleSecurityProcedureResponse<SecurityProcedureStandard>>(
      `/WebSite/Standard/id?id=${id}`,
    )

    this.setCache(cacheKey, response)
    return response
  }

  // Controls
  async getControlsByStandardId(
    standardId: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureControl>> {
    const cacheKey = this.getCacheKey("getControlsByStandardId", { standardId, page, pageSize })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const params = new URLSearchParams({
      PageNumber: page.toString(),
      PageSize: pageSize.toString(),
      standardId: standardId,
    })

    const response = await this.apiDataSource.get<PaginatedSecurityProcedureResponse<SecurityProcedureControl>>(
      `/WebSite/StandardControl?${params.toString()}`,
    )

    this.setCache(cacheKey, response)
    return response
  }

  async getControlById(id: string): Promise<SingleSecurityProcedureResponse<SecurityProcedureControl["control"]>> {
    const cacheKey = this.getCacheKey("getControlById", { id })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const response = await this.apiDataSource.get<SingleSecurityProcedureResponse<SecurityProcedureControl["control"]>>(
      `/WebSite/Control/id?id=${id}`,
    )

    this.setCache(cacheKey, response)
    return response
  }

  // Safeguards
  async getSafeguardsByControlId(
    controlId: string,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureSafeguard>> {
    const cacheKey = this.getCacheKey("getSafeguardsByControlId", { controlId })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const response = await this.apiDataSource.get<PaginatedSecurityProcedureResponse<SecurityProcedureSafeguard>>(
      `/WebSite/SafeGuardByControlId?ControlId=${controlId}`,
    )

    this.setCache(cacheKey, response)
    return response
  }

  async getSafeguardById(id: string): Promise<SingleSecurityProcedureResponse<SecurityProcedureSafeguard>> {
    const cacheKey = this.getCacheKey("getSafeguardById", { id })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const response = await this.apiDataSource.get<SingleSecurityProcedureResponse<SecurityProcedureSafeguard>>(
      `/WebSite/SafeGuard/id?id=${id}`,
    )

    this.setCache(cacheKey, response)
    return response
  }

  // Techniques
  async getTechniquesBySafeguardId(
    safeguardId: string,
    page = 1,
    pageSize = 10,
    search = "",
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureTechnique>> {
    const cacheKey = this.getCacheKey("getTechniquesBySafeguardId", { safeguardId, page, pageSize, search })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const params = new URLSearchParams({
      PageNumber: page.toString(),
      PageSize: pageSize.toString(),
      SafeGuardId: safeguardId,
    })

    if (search) {
      params.append("PageSearch", search)
    }

    const response = await this.apiDataSource.get<PaginatedSecurityProcedureResponse<SecurityProcedureTechnique>>(
      `/WebSite/Technique?${params.toString()}`,
    )

    this.setCache(cacheKey, response)
    return response
  }

  async getTechniqueById(
    id: string,
  ): Promise<SingleSecurityProcedureResponse<SecurityProcedureTechnique["technique"]>> {
    const cacheKey = this.getCacheKey("getTechniqueById", { id })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const response = await this.apiDataSource.get<
      SingleSecurityProcedureResponse<SecurityProcedureTechnique["technique"]>
    >(`/WebSite/Technique/id?id=${id}`)

    this.setCache(cacheKey, response)
    return response
  }

  // Implementation Steps
  async getImplementationStepsByTechniqueId(
    techniqueId: string,
  ): Promise<PaginatedSecurityProcedureResponse<SecurityProcedureImplementationStep>> {
    const cacheKey = this.getCacheKey("getImplementationStepsByTechniqueId", { techniqueId })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const response = await this.apiDataSource.get<
      PaginatedSecurityProcedureResponse<SecurityProcedureImplementationStep>
    >(`/WebSite/ImplementationStep?techniqueId=${techniqueId}`)

    this.setCache(cacheKey, response)
    return response
  }

  async getImplementationStepById(
    id: string,
  ): Promise<SingleSecurityProcedureResponse<SecurityProcedureImplementationStep["implementationStep"]>> {
    const cacheKey = this.getCacheKey("getImplementationStepById", { id })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const response = await this.apiDataSource.get<
      SingleSecurityProcedureResponse<SecurityProcedureImplementationStep["implementationStep"]>
    >(`/WebSite/ImplementationStep/id?id=${id}`)

    this.setCache(cacheKey, response)
    return response
  }
}
