import type { InstructionYear, InstructionYearsResponse } from "../domain/models/instruction-year"
import type { InstructionYearsRepository } from "../domain/repositories/instruction-years-repository"

export class InstructionYearsService {
  constructor(private repository: InstructionYearsRepository) {}

  async getYearsByCategory(categoryId: string, page?: number, pageSize?: number): Promise<InstructionYearsResponse> {
    return this.repository.getYearsByCategory(categoryId, page, pageSize)
  }

  async getYearById(id: string): Promise<InstructionYear | null> {
    return this.repository.getYearById(id)
  }

  async getYearByCategoryAndYear(categoryId: string, year: number): Promise<InstructionYear | null> {
    return this.repository.getYearByCategoryAndYear(categoryId, year)
  }
}
