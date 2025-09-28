import type { PersonalProtectCategoryRepository } from '@/core/domain/repositories/personal-protect-category-repository'
import type { PersonalProtectCategory, PersonalProtectCategoriesResponse } from '@/entities'
import { ApiDataSource } from '@/core/data/sources/api-data-source'

export class PersonalProtectCategoryRepositoryImpl implements PersonalProtectCategoryRepository {
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

  private transformPersonalProtectCategory(category: PersonalProtectCategory): PersonalProtectCategory {
    return {
      ...category,
      imageUrl: this.transformImageUrl(category.imageUrl) || category.imageUrl
    }
  }

  async getPersonalProtectCategories(page = 1, pageSize = 10, search?: string): Promise<PersonalProtectCategoriesResponse> {
    try {
      let endpoint = `/PersonalProtectCategories?page=${page}&pageSize=${pageSize}`
      
      if (search && search.trim()) {
        endpoint += `&search=${encodeURIComponent(search.trim())}`
      }

      console.log(`📡 Fetching personal protect categories from: ${endpoint}`)
      const response = await this.apiDataSource.get<PersonalProtectCategoriesResponse>(endpoint)
      
      // Transform image URLs for all categories
      const transformedData = response.data.map(category => this.transformPersonalProtectCategory(category))
      
      console.log(`✅ Successfully fetched ${transformedData.length} personal protect categories`)
      return {
        ...response,
        data: transformedData
      }
    } catch (error) {
      console.error('❌ Error fetching personal protect categories:', error)
      throw error
    }
  }
}
