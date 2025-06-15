import type { LawsRepository } from "../domain/repositories/laws-repository"
import type { Law, LawsPaginatedResponse } from "../domain/models/law"
import type { LawCategory, LawCategoriesPaginatedResponse } from "../domain/models/law-category"

export class LawsService {
  private repository: LawsRepository

  constructor(repository: LawsRepository) {
    this.repository = repository
  }

  async getAllCategories(page?: number, pageSize?: number): Promise<LawCategoriesPaginatedResponse> {
    return await this.repository.getAllCategories(page, pageSize)
  }

  async getCategoryById(id: string): Promise<LawCategory> {
    return await this.repository.getCategoryById(id)
  }

  async getCategoryBySlug(slug: string): Promise<LawCategory | null> {
    return await this.repository.getCategoryBySlug(slug)
  }

  async getLawsByCategory(categoryId: string, page?: number, pageSize?: number): Promise<LawsPaginatedResponse> {
    return await this.repository.getLawsByCategory(categoryId, page, pageSize)
  }

  async getLawById(id: string): Promise<Law> {
    return await this.repository.getLawById(id)
  }

  async getLawBySlug(slug: string): Promise<Law | null> {
    return await this.repository.getLawBySlug(slug)
  }
}
