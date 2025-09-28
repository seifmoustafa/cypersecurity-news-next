import type { PersonalProtectCategoryRepository } from '@/core/domain/repositories/personal-protect-category-repository'
import type { PersonalProtectCategory, PersonalProtectCategoriesResponse } from '@/entities'

export class PersonalProtectCategoryService {
  constructor(private personalProtectCategoryRepository: PersonalProtectCategoryRepository) {}

  async getPersonalProtectCategories(page = 1, pageSize = 10, search?: string): Promise<PersonalProtectCategoriesResponse> {
    return this.personalProtectCategoryRepository.getPersonalProtectCategories(page, pageSize, search)
  }
}
