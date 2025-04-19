import type { TickerRepository } from "../domain/repositories/ticker-repository"
import type { TickerItem } from "../domain/models/ticker-item"

export class TickerService {
  private repository: TickerRepository

  constructor(repository: TickerRepository) {
    this.repository = repository
  }

  async getTickerItems(): Promise<TickerItem[]> {
    return this.repository.getTickerItems()
  }
}
