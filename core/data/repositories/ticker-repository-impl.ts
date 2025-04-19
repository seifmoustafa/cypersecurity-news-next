import type { TickerRepository } from "../../domain/repositories/ticker-repository"
import type { TickerItem } from "../../domain/models/ticker-item"
import type { MockDataSource } from "../sources/mock-data-source"

export class TickerRepositoryImpl implements TickerRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getTickerItems(): Promise<TickerItem[]> {
    return this.dataSource.getTickerItems()
  }
}
