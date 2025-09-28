import type { ReferenceRepository } from '@/core/domain/repositories/reference-repository'
import type { Reference, ReferenceResponse } from '@/entities'
import { ApiDataSource } from '@/core/data/sources/api-data-source'

export class ReferenceRepositoryImpl implements ReferenceRepository {
  private apiDataSource: ApiDataSource

  constructor() {
    this.apiDataSource = new ApiDataSource()
  }

  private transformDocumentUrl(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith("http")) return url

    // Remove /api from the base URL for documents
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    return `${baseUrl}${url}`
  }

  private transformReference(reference: Reference): Reference {
    return {
      ...reference,
      pdfUrl: this.transformDocumentUrl(reference.pdfUrl)
    }
  }

  async getReferences(page = 1, pageSize = 10, search?: string): Promise<ReferenceResponse> {
    try {
      let endpoint = `/Reference?page=${page}&pageSize=${pageSize}`
      
      if (search && search.trim()) {
        endpoint += `&search=${encodeURIComponent(search.trim())}`
      }

      console.log(`📡 Fetching references from: ${endpoint}`)
      const response = await this.apiDataSource.get<ReferenceResponse>(endpoint)
      
      // Transform document URLs for all references
      const transformedData = response.data.map(ref => this.transformReference(ref))
      
      console.log(`✅ Successfully fetched ${transformedData.length} references`)
      return {
        ...response,
        data: transformedData
      }
    } catch (error) {
      console.error('❌ Error fetching references:', error)
      throw error
    }
  }

  async getReferenceById(id: string): Promise<Reference> {
    try {
      const endpoint = `/Reference/${id}`
      console.log(`📡 Fetching reference by ID: ${endpoint}`)
      
      const response = await this.apiDataSource.get<Reference>(endpoint)
      
      // Transform document URL
      const transformedReference = this.transformReference(response)
      
      console.log(`✅ Successfully fetched reference: ${transformedReference.title}`)
      return transformedReference
    } catch (error) {
      console.error(`❌ Error fetching reference by ID ${id}:`, error)
      throw error
    }
  }
}
