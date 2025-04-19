import type { InstructionsRepository } from "../domain/repositories/instructions-repository"
import type { Instruction } from "../domain/models/instruction"

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
}
