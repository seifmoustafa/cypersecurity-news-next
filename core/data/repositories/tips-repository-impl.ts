import type { TipsRepository } from "../../domain/repositories/tips-repository"
import type { Tip, TipResponse } from "@/entities"
import type { ApiDataSource } from "../sources/api-data-source"

export class TipsRepositoryImpl implements TipsRepository {
  private apiDataSource: ApiDataSource

  constructor(apiDataSource: ApiDataSource) {
    this.apiDataSource = apiDataSource
  }

  async getRandomTip(): Promise<Tip | null> {
    try {
      const response = await fetch(`${this.apiDataSource.getBaseUrl()}/Tips/random`)

      // Handle 204 No Content - no tips available
      if (response.status === 204) {
        return null
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const tipResponse = (await response.json()) as TipResponse

      // Transform API response to our entity
      const tip: Tip = {
        id: tipResponse.id,
        title: tipResponse.title,
        titleEn: tipResponse.titleEn,
        subtitle: tipResponse.subtitle,
        subtitleEn: tipResponse.subtitleEn,
        summary: tipResponse.summary,
        summaryEn: tipResponse.summaryEn,
        isActive: tipResponse.isActive,
        createdAt: tipResponse.createdAt,
        updatedAt: tipResponse.updatedAt,
      }

      return tip
    } catch (error) {
      console.error("Error fetching random tip:", error)
      throw new Error("Failed to fetch random tip")
    }
  }
}
