import type { TickerRepository } from "../domain/repositories/ticker-repository"
import type { TickerItem } from "../domain/models/ticker-item"

export class TickerService {
  private repository: TickerRepository

  constructor(repository: TickerRepository) {
    this.repository = repository
  }

  async getTickerItems(): Promise<TickerItem[]> {
    try {
      return await this.repository.getTickerItems()
    } catch (error) {
      console.error("Error in ticker service:", error)
      // Return empty array on error to prevent UI crashes
      return []
    }
  }
}
