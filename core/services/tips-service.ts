import type { TipsRepository } from "../domain/repositories/tips-repository"
import type { Tip } from "@/entities"

export class TipsService {
  private repository: TipsRepository

  constructor(repository: TipsRepository) {
    this.repository = repository
  }

  async getRandomTip(): Promise<Tip | null> {
    try {
      return await this.repository.getRandomTip()
    } catch (error) {
      console.error("Error in TipsService.getRandomTip:", error)
      throw error
    }
  }
}
