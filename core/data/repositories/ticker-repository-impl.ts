import type { TickerRepository } from "../../domain/repositories/ticker-repository"
import type { TickerItem } from "../../domain/models/ticker-item"
import type { ApiDataSource } from "../sources/api-data-source"
import type { Tip } from "../../../entities/tip.entity"

export class TickerRepositoryImpl implements TickerRepository {
  private apiDataSource: ApiDataSource

  constructor(apiDataSource: ApiDataSource) {
    this.apiDataSource = apiDataSource
  }

  async getTickerItems(): Promise<TickerItem[]> {
    try {
      const apiItems = await this.apiDataSource.get<Tip[]>("/Tips/latest")

      // Transform API response to match UI expectations
      return apiItems.map((tip) => ({
        id: tip.id,
        title: tip.title,
        titleEn: tip.titleEn,
        type: "info" as const,
        text: {
          // Arabic: use title, fallback to titleEn if title is null
          ar: tip.title || tip.titleEn || "",
          // English: use titleEn, fallback to title if titleEn is null
          en: tip.titleEn || tip.title || "",
        },
      }))
    } catch (error) {
      console.error("Error fetching ticker items:", error)
      throw error
    }
  }
}
