import type { TickerRepository } from "../../domain/repositories/ticker-repository"
import type { TickerItem } from "../../domain/models/ticker-item"
import type { ApiDataSource } from "../sources/api-data-source"

export class TickerRepositoryImpl implements TickerRepository {
  private apiDataSource: ApiDataSource

  constructor(apiDataSource: ApiDataSource) {
    this.apiDataSource = apiDataSource
  }

  async getTickerItems(): Promise<TickerItem[]> {
    try {
      const apiItems = await this.apiDataSource.get<TickerItem[]>("/News/ticker")

      // Transform API response to match UI expectations
      return apiItems.map((item) => ({
        ...item,
        type: "info" as const,
        text: {
          // Arabic: use title, fallback to titleEn if title is null
          ar: item.title || item.titleEn || "",
          // English: use titleEn, fallback to title if titleEn is null
          en: item.titleEn || item.title || "",
        },
      }))
    } catch (error) {
      console.error("Error fetching ticker items:", error)
      throw error
    }
  }
}
