import type { PersonalProtectSubCategory, PersonalProtectSubCategoriesResponse } from '@/entities'

export interface PersonalProtectSubCategoryRepository {
  getPersonalProtectSubCategoriesByCategoryId(categoryId: string, page?: number, pageSize?: number, search?: string): Promise<PersonalProtectSubCategoriesResponse>
}
