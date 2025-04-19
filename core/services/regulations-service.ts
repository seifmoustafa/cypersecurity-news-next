import type { RegulationsRepository } from "../domain/repositories/regulations-repository"
import type { Regulation } from "../domain/models/regulation"

export class RegulationsService {
  private repository: RegulationsRepository

  constructor(repository: RegulationsRepository) {
    this.repository = repository
  }

  async getAllRegulations(): Promise<Regulation[]> {
    return this.repository.getAllRegulations()
  }

  async getRegulationById(id: string): Promise<Regulation | null> {
    return this.repository.getRegulationById(id)
  }
}
