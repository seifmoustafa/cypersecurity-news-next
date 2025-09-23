import type { ApiDataSource } from "../sources/api-data-source"
import type { AwarenessRepository } from "../../domain/repositories/awareness-repository"
import type { AwarenessResponse, AwarenessYearResponse, Awareness, AwarenessYear } from "../../domain/models/awareness"
import { slugify } from "@/lib/utils"

export class AwarenessRepositoryImpl implements AwarenessRepository {
  constructor(private apiDataSource: ApiDataSource) {}

  async getCurrentYearAwareness(search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.apiDataSource.get(`/advanced/awareness/currentYear?${params}`)
  }

  async getAllAwarenessYears(search = "", page = 1, pageSize = 10): Promise<AwarenessYearResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.apiDataSource.get(`/advanced/awarenessYears?${params}`)
  }

  async getAwarenessYearById(id: string): Promise<AwarenessYear> {
    return this.apiDataSource.get(`/advanced/awarenessYears/${id}`)
  }

  async getAwarenessByYearId(yearId: string, search = "", page = 1, pageSize = 10): Promise<AwarenessResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.apiDataSource.get(`/advanced/awareness/byYear/${yearId}?${params}`)
  }

  async getAwarenessById(id: string): Promise<Awareness> {
    return this.apiDataSource.get(`/advanced/awareness/${id}`)
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
