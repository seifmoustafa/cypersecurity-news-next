import type { RegulationCategoriesRepository } from "../domain/repositories/regulation-categories-repository"
import type { RegulationCategory, RegulationCategoriesResponse } from "../domain/models/regulation-category"

export class RegulationCategoriesService {
  private repository: RegulationCategoriesRepository

  constructor(repository: RegulationCategoriesRepository) {
    this.repository = repository
  }

  async getAllCategories(page?: number, pageSize?: number): Promise<RegulationCategoriesResponse> {
    return this.repository.getAllCategories(page, pageSize)
  }

  async getCategoryById(id: string): Promise<RegulationCategory | null> {
    return this.repository.getCategoryById(id)
  }

  async getCategoryBySlug(slug: string): Promise<RegulationCategory | null> {
    return this.repository.getCategoryBySlug(slug)
  }
}
