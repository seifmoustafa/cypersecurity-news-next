import type { TipsRepository } from "../../domain/repositories/tips-repository"
import type { Tip } from "../../domain/models/tip"
import type { MockDataSource } from "../sources/mock-data-source"

export class TipsRepositoryImpl implements TipsRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllTips(): Promise<Tip[]> {
    return this.dataSource.getAllTips()
  }

  async getRandomTip(): Promise<Tip> {
    return this.dataSource.getRandomTip()
  }
}
