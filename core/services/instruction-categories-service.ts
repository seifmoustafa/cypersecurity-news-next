import type { InstructionCategory, InstructionCategoriesResponse } from "../domain/models/instruction-category"
import type { InstructionCategoriesRepository } from "../domain/repositories/instruction-categories-repository"

export class InstructionCategoriesService {
  constructor(private repository: InstructionCategoriesRepository) {}

  async getAllCategories(page?: number, pageSize?: number): Promise<InstructionCategoriesResponse> {
    return this.repository.getAllCategories(page, pageSize)
  }

  async getCategoryById(id: string): Promise<InstructionCategory | null> {
    return this.repository.getCategoryById(id)
  }

  async getCategoryBySlug(slug: string): Promise<InstructionCategory | null> {
    return this.repository.getCategoryBySlug(slug)
  }
}
