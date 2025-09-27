import type { ApiDataSource } from "../sources/api-data-source"
import type { AwarenessRepository } from "../../domain/repositories/awareness-repository"
import type { AwarenessResponse, AwarenessYearResponse, Awareness, AwarenessYear } from "../../domain/models/awareness"
import { slugify } from "@/lib/utils"

export class AwarenessRepositoryImpl implements AwarenessRepository {
  private baseImageUrl: string

  constructor(private apiDataSource: ApiDataSource) {
    // Remove "/api" from the base URL for document URLs (same as news images)
    this.baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
  }

  private transformAwarenessItem(item: Awareness): Awareness {
    return {
      ...item,
      // Add full document URL if documentUrl exists (same pattern as news images)
      documentUrl: item.documentUrl ? `${this.baseImageUrl}${item.documentUrl}` : undefined,
    }
  }

  private transformAwarenessData(awarenessItems: Awareness[]): Awareness[] {
    return awarenessItems.map((item) => this.transformAwarenessItem(item))
  }

  async getCurrentYearAwareness(search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await this.apiDataSource.get<AwarenessResponse>(`/awareness/currentYear?${params}`)
    return {
      ...response,
      data: this.transformAwarenessData(response.data)
    }
  }

  async getAllAwarenessYears(search = "", page = 1, pageSize = 10): Promise<AwarenessYearResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.apiDataSource.get(`/awarenessYears?${params}`)
  }

  async getAwarenessYearById(id: string): Promise<AwarenessYear> {
    return this.apiDataSource.get(`/awarenessYears/${id}`)
  }

  async getAwarenessByYearId(yearId: string, search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await this.apiDataSource.get<AwarenessResponse>(`/awareness/byYear/${yearId}?${params}`)
    return {
      ...response,
      data: this.transformAwarenessData(response.data)
    }
  }

  async getAwarenessById(id: string): Promise<Awareness> {
    const awareness = await this.apiDataSource.get<Awareness>(`/awareness/${id}`)
    return this.transformAwarenessItem(awareness)
  }

  async getAwarenessByYearAndSlug(year: string, slug: string): Promise<Awareness | null> {
    try {
      // Find year ID first
      const years = await this.getAllAwarenessYears("", 1, 100)
      const foundYear = years.data.find((y) => y.year.toString() === year)
      if (!foundYear) return null

      // Fetch awareness items for that year and find by slug
      const awarenessData = await this.getAwarenessByYearId(foundYear.id, "", 1, 100)
      const item = awarenessData.data.find((aw) => {
        const titleEn = aw.titleEn || aw.title || ""
        return slugify(titleEn, aw.id) === slug
      })

      return item || null
    } catch (error) {
      console.error(`Error finding awareness by slug ${slug} for year ${year}:`, error)
      return null
    }
  }
}
