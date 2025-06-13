import type { InstructionCategory, InstructionCategoriesResponse } from "../models/instruction-category"

export interface InstructionCategoriesRepository {
  getAllCategories(page?: number, pageSize?: number): Promise<InstructionCategoriesResponse>
  getCategoryById(id: string): Promise<InstructionCategory | null>
  getCategoryBySlug(slug: string): Promise<InstructionCategory | null>
}
