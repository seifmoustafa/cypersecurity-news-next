import type { PersonalProtectCategory, PersonalProtectCategoriesResponse } from '@/entities'

export interface PersonalProtectCategoryRepository {
  getPersonalProtectCategories(page?: number, pageSize?: number, search?: string): Promise<PersonalProtectCategoriesResponse>
}
