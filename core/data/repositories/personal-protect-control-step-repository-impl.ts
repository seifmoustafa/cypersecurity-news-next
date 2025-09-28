import type { PersonalProtectControlStepRepository } from '@/core/domain/repositories/personal-protect-control-step-repository'
import type { PersonalProtectControlStep, PersonalProtectControlStepsResponse } from '@/entities'
import { ApiDataSource } from '@/core/data/sources/api-data-source'

export class PersonalProtectControlStepRepositoryImpl implements PersonalProtectControlStepRepository {
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

  private transformVideoUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for videos
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformDocumentUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformPersonalProtectControlStep(step: PersonalProtectControlStep): PersonalProtectControlStep {
    return {
      ...step,
      imageUrl: this.transformImageUrl(step.imageUrl),
      videoUrl: this.transformVideoUrl(step.videoUrl),
      documentUrl: this.transformDocumentUrl(step.documentUrl)
    }
  }

  async getPersonalProtectControlStepsByControlId(controlId: string, page = 1, pageSize = 10, search?: string): Promise<PersonalProtectControlStepsResponse> {
    try {
      let endpoint = `/PersonalProtectControlSteps/byControl/${controlId}?page=${page}&pageSize=${pageSize}`
      
      if (search && search.trim()) {
        endpoint += `&search=${encodeURIComponent(search.trim())}`
      }

      console.log(`📡 Fetching personal protect control steps from: ${endpoint}`)
      const response = await this.apiDataSource.get<PersonalProtectControlStepsResponse>(endpoint)
      
      // Transform URLs for all steps
      const transformedData = response.data.map(step => this.transformPersonalProtectControlStep(step))
      
      console.log(`✅ Successfully fetched ${transformedData.length} personal protect control steps`)
      return {
        ...response,
        data: transformedData
      }
    } catch (error) {
      console.error('❌ Error fetching personal protect control steps:', error)
      throw error
    }
  }

  async getPersonalProtectControlStepById(stepId: string): Promise<PersonalProtectControlStep> {
    try {
      const endpoint = `/PersonalProtectControlSteps/${stepId}`
      console.log(`📡 Fetching personal protect control step by ID: ${endpoint}`)
      
      const response = await this.apiDataSource.get<PersonalProtectControlStep>(endpoint)
      
      // Transform URLs
      const transformedStep = this.transformPersonalProtectControlStep(response)
      
      console.log(`✅ Successfully fetched personal protect control step: ${transformedStep.name}`)
      return transformedStep
    } catch (error) {
      console.error(`❌ Error fetching personal protect control step by ID ${stepId}:`, error)
      throw error
    }
  }
}
