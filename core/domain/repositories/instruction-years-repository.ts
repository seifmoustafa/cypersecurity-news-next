import type { InstructionYear, InstructionYearsResponse } from "../models/instruction-year"

export interface InstructionYearsRepository {
  getYearsByCategory(categoryId: string, page?: number, pageSize?: number): Promise<InstructionYearsResponse>
  getYearById(id: string): Promise<InstructionYear | null>
  getYearByCategoryAndYear(categoryId: string, year: number): Promise<InstructionYear | null>
}
