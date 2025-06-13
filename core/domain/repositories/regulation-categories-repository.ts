import type { RegulationCategory, RegulationCategoriesResponse } from "../models/regulation-category"

export interface RegulationCategoriesRepository {
  getAllCategories(page?: number, pageSize?: number): Promise<RegulationCategoriesResponse>
  getCategoryById(id: string): Promise<RegulationCategory | null>
  getCategoryBySlug(slug: string): Promise<RegulationCategory | null>
}
