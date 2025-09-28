import type { PersonalProtectControlRepository } from '@/core/domain/repositories/personal-protect-control-repository'
import type { PersonalProtectControl, PersonalProtectControlsResponse } from '@/entities'
import { ApiDataSource } from '@/core/data/sources/api-data-source'

export class PersonalProtectControlRepositoryImpl implements PersonalProtectControlRepository {
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

  private transformPersonalProtectControl(control: PersonalProtectControl): PersonalProtectControl {
    return {
      ...control,
      imageUrl: this.transformImageUrl(control.imageUrl) || control.imageUrl
    }
  }

  async getPersonalProtectControlsBySubCategoryId(subCategoryId: string, page = 1, pageSize = 10, search?: string): Promise<PersonalProtectControlsResponse> {
    try {
      let endpoint = `/PersonalProtectControls/bySubCategory/${subCategoryId}?page=${page}&pageSize=${pageSize}`
      
      if (search && search.trim()) {
        endpoint += `&search=${encodeURIComponent(search.trim())}`
      }

      console.log(`📡 Fetching personal protect controls from: ${endpoint}`)
      const response = await this.apiDataSource.get<PersonalProtectControlsResponse>(endpoint)
      
      // Transform image URLs for all controls
      const transformedData = response.data.map(control => this.transformPersonalProtectControl(control))
      
      console.log(`✅ Successfully fetched ${transformedData.length} personal protect controls`)
      return {
        ...response,
        data: transformedData
      }
    } catch (error) {
      console.error('❌ Error fetching personal protect controls:', error)
      throw error
    }
  }
}
