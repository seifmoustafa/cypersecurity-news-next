import type { AwarenessRepository } from "../domain/repositories/awareness-repository"
import type { AwarenessResponse, AwarenessYearResponse, Awareness, AwarenessYear } from "../domain/models/awareness"

export class AwarenessService {
  constructor(private awarenessRepository: AwarenessRepository) {}

  async getCurrentYearAwareness(search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    return this.awarenessRepository.getCurrentYearAwareness(search, page, pageSize)
  }

  async getAllAwarenessYears(search = "", page = 1, pageSize = 10): Promise<AwarenessYearResponse> {
    return this.awarenessRepository.getAllAwarenessYears(search, page, pageSize)
  }

  async getAwarenessYearById(id: string): Promise<AwarenessYear> {
    return this.awarenessRepository.getAwarenessYearById(id)
  }

  async getAwarenessByYearId(yearId: string, search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    return this.awarenessRepository.getAwarenessByYearId(yearId, search, page, pageSize)
  }

  async getAwarenessById(id: string): Promise<Awareness> {
    return this.awarenessRepository.getAwarenessById(id)
  }
}
