import type { PersonalProtectSubCategoryRepository } from '@/core/domain/repositories/personal-protect-subcategory-repository'
import type { PersonalProtectSubCategory, PersonalProtectSubCategoriesResponse } from '@/entities'

export class PersonalProtectSubCategoryService {
  constructor(private personalProtectSubCategoryRepository: PersonalProtectSubCategoryRepository) {}

  async getPersonalProtectSubCategoriesByCategoryId(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<PersonalProtectSubCategoriesResponse> {
    return this.personalProtectSubCategoryRepository.getPersonalProtectSubCategoriesByCategoryId(categoryId, page, pageSize, search)
  }
}
