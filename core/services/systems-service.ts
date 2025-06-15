import type { SystemsRepository } from "../domain/repositories/systems-repository"
import type { System, SystemsPaginatedResponse } from "../domain/models/system"

export class SystemsService {
  private repository: SystemsRepository

  constructor(repository: SystemsRepository) {
    this.repository = repository
  }

  async getAllSystems(page = 1, pageSize = 10, search?: string): Promise<SystemsPaginatedResponse> {
    return this.repository.getAllSystems(page, pageSize, search)
  }

  async getSystemById(id: string): Promise<System | null> {
    return this.repository.getSystemById(id)
  }
}
