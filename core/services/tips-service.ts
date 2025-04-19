import type { TipsRepository } from "../domain/repositories/tips-repository"
import type { Tip } from "../domain/models/tip"

export class TipsService {
  private repository: TipsRepository

  constructor(repository: TipsRepository) {
    this.repository = repository
  }

  async getAllTips(): Promise<Tip[]> {
    return this.repository.getAllTips()
  }

  async getRandomTip(): Promise<Tip> {
    return this.repository.getRandomTip()
  }
}
