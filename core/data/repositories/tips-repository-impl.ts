import type { TipsRepository } from "../../domain/repositories/tips-repository"
import type { Tip, TipResponse } from "@/entities"
import type { ApiDataSource } from "../sources/api-data-source"

export class TipsRepositoryImpl implements TipsRepository {
  private apiDataSource: ApiDataSource

  constructor(apiDataSource: ApiDataSource) {
    this.apiDataSource = apiDataSource
  }

  async getRandomTip(): Promise<Tip> {
    try {
      const response = await this.apiDataSource.get<TipResponse>("/Tips/random")

      // Transform API response to our entity
      const tip: Tip = {
        id: response.id,
        title: response.title,
        titleEn: response.titleEn,
        subtitle: response.subtitle,
        subtitleEn: response.subtitleEn,
        summary: response.summary,
        summaryEn: response.summaryEn,
        isActive: response.isActive,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }

      return tip
    } catch (error) {
      console.error("Error fetching random tip:", error)
      throw new Error("Failed to fetch random tip")
    }
  }
}
