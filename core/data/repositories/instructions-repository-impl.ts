import type { InstructionsRepository } from "../../domain/repositories/instructions-repository"
import type { Instruction } from "../../domain/models/instruction"
import type { MockDataSource } from "../sources/mock-data-source"

export class InstructionsRepositoryImpl implements InstructionsRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllInstructions(): Promise<Instruction[]> {
    return this.dataSource.getAllInstructions()
  }

  async getInstructionsByType(type: "group" | "branch"): Promise<Instruction[]> {
    return this.dataSource.getInstructionsByType(type)
  }

  async getInstructionsByYear(year: string): Promise<Instruction[]> {
    return this.dataSource.getInstructionsByYear(year)
  }

  async getInstructionsByTypeAndYear(type: "group" | "branch", year: string): Promise<Instruction | null> {
    return this.dataSource.getInstructionsByTypeAndYear(type, year)
  }

  async getYearsByType(type: "group" | "branch"): Promise<string[]> {
    return this.dataSource.getYearsByType(type)
  }
}
