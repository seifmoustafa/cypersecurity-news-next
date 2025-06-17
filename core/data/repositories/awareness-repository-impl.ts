import type { ApiDataSource } from "../sources/api-data-source"
import type { AwarenessRepository } from "../../domain/repositories/awareness-repository"
import type { AwarenessResponse, AwarenessYearResponse, Awareness, AwarenessYear } from "../../domain/models/awareness"

export class AwarenessRepositoryImpl implements AwarenessRepository {
  constructor(private apiDataSource: ApiDataSource) {}

  async getCurrentYearAwareness(search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.apiDataSource.get(`/Awareness/currentYear?${params}`)
  }

  async getAllAwarenessYears(search = "", page = 1, pageSize = 10): Promise<AwarenessYearResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.apiDataSource.get(`/AwarenessYears?${params}`)
  }

  async getAwarenessYearById(id: string): Promise<AwarenessYear> {
    return this.apiDataSource.get(`/AwarenessYears/${id}`)
  }

  async getAwarenessByYearId(yearId: string, search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.apiDataSource.get(`/Awareness/byYear/${yearId}?${params}`)
  }

  async getAwarenessById(id: string): Promise<Awareness> {
    return this.apiDataSource.get(`/Awareness/${id}`)
  }
}
