import type { SystemsRepository } from "../domain/repositories/systems-repository"
import type { System } from "../domain/models/system"

export class SystemsService {
  private repository: SystemsRepository

  constructor(repository: SystemsRepository) {
    this.repository = repository
  }

  async getAllSystems(): Promise<System[]> {
    return this.repository.getAllSystems()
  }

  async getSystemById(id: string): Promise<System | null> {
    return this.repository.getSystemById(id)
  }
}
