import type { Law, LawsPaginatedResponse } from "../models/law"
import type { LawCategory, LawCategoriesPaginatedResponse } from "../models/law-category"

export interface LawsRepository {
  getAllCategories(page?: number, pageSize?: number): Promise<LawCategoriesPaginatedResponse>
  getCategoryById(id: string): Promise<LawCategory>
  getLawsByCategory(categoryId: string, page?: number, pageSize?: number): Promise<LawsPaginatedResponse>
  getLawById(id: string): Promise<Law>
  getCategoryBySlug(slug: string): Promise<LawCategory | null>
  getLawBySlug(slug: string): Promise<Law | null>
}
