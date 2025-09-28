import type { PersonalProtectSubCategoryRepository } from '@/core/domain/repositories/personal-protect-subcategory-repository'
import type { PersonalProtectSubCategory, PersonalProtectSubCategoriesResponse } from '@/entities'
import { ApiDataSource } from '@/core/data/sources/api-data-source'

export class PersonalProtectSubCategoryRepositoryImpl implements PersonalProtectSubCategoryRepository {
  private apiDataSource: ApiDataSource

  constructor() {
    this.apiDataSource = new ApiDataSource()
  }

  private transformImageUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for images
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformPersonalProtectSubCategory(subCategory: PersonalProtectSubCategory): PersonalProtectSubCategory {
    return {
      ...subCategory,
      imageUrl: this.transformImageUrl(subCategory.imageUrl) || subCategory.imageUrl
    }
  }

  async getPersonalProtectSubCategoriesByCategoryId(categoryId: string, page = 1, pageSize = 10, search?: string): Promise<PersonalProtectSubCategoriesResponse> {
    try {
      let endpoint = `/PersonalProtectSubCategories/byCategory/${categoryId}?page=${page}&pageSize=${pageSize}`
      
      if (search && search.trim()) {
        endpoint += `&search=${encodeURIComponent(search.trim())}`
      }

      console.log(`📡 Fetching personal protect subcategories from: ${endpoint}`)
      const response = await this.apiDataSource.get<PersonalProtectSubCategoriesResponse>(endpoint)
      
      // Transform image URLs for all subcategories
      const transformedData = response.data.map(subCategory => this.transformPersonalProtectSubCategory(subCategory))
      
      console.log(`✅ Successfully fetched ${transformedData.length} personal protect subcategories`)
      return {
        ...response,
        data: transformedData
      }
    } catch (error) {
      console.error('❌ Error fetching personal protect subcategories:', error)
      throw error
    }
  }
}
