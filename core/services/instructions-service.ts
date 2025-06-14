import type { InstructionsRepository } from "../domain/repositories/instructions-repository"
import type { Instruction, InstructionsPaginatedResponse } from "../domain/models/instruction"

export class InstructionsService {
  private repository: InstructionsRepository

  constructor(repository: InstructionsRepository) {
    this.repository = repository
  }

  async getAllInstructions(): Promise<Instruction[]> {
    return this.repository.getAllInstructions()
  }

  async getInstructionsByType(type: "group" | "branch"): Promise<Instruction[]> {
    return this.repository.getInstructionsByType(type)
  }

  async getInstructionsByYear(year: string): Promise<Instruction[]> {
    return this.repository.getInstructionsByYear(year)
  }

  async getInstructionsByTypeAndYear(type: "group" | "branch", year: string): Promise<Instruction | null> {
    return this.repository.getInstructionsByTypeAndYear(type, year)
  }

  async getYearsByType(type: "group" | "branch"): Promise<string[]> {
    return this.repository.getYearsByType(type)
  }

  async getInstructionsByYearId(
    yearId: string,
    page?: number,
    pageSize?: number,
  ): Promise<InstructionsPaginatedResponse> {
    return this.repository.getInstructionsByYearId(yearId, page, pageSize)
  }

  async getInstructionById(id: string, forceRefresh = false): Promise<Instruction | null> {
    return this.repository.getInstructionById(id, forceRefresh)
  }

  // Add method to clear cache
  clearCache(): void {
    if ("clearCache" in this.repository) {
      ;(this.repository as any).clearCache()
    }
  }
}
