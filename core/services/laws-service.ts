import type { LawsRepository } from "../domain/repositories/laws-repository"
import type { Law, LawCategory } from "../domain/models/law"

export class LawsService {
  private repository: LawsRepository

  constructor(repository: LawsRepository) {
    this.repository = repository
  }

  async getAllLaws(): Promise<Law[]> {
    return this.repository.getAllLaws()
  }

  async getLawById(id: string): Promise<Law | null> {
    return this.repository.getLawById(id)
  }

  async getLawsByCategory(category: string): Promise<Law[]> {
    return this.repository.getLawsByCategory(category)
  }

  async getLawCategories(): Promise<LawCategory[]> {
    return this.repository.getLawCategories()
  }
}
