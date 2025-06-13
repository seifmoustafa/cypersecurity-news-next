import type { RegulationsRepository } from "../domain/repositories/regulations-repository"
import type { Regulation, RegulationsResponse } from "../domain/models/regulation"

export class RegulationsService {
  private repository: RegulationsRepository

  constructor(repository: RegulationsRepository) {
    this.repository = repository
  }

  async getAllRegulations(page?: number, pageSize?: number): Promise<RegulationsResponse> {
    return this.repository.getAllRegulations(page, pageSize)
  }

  async getRegulationsByCategory(categoryId: string, page?: number, pageSize?: number): Promise<RegulationsResponse> {
    return this.repository.getRegulationsByCategory(categoryId, page, pageSize)
  }

  async getRegulationById(id: string): Promise<Regulation | null> {
    return this.repository.getRegulationById(id)
  }

  async getRegulationBySlug(slug: string): Promise<Regulation | null> {
    return this.repository.getRegulationBySlug(slug)
  }
}
