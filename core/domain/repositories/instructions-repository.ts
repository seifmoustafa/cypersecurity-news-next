import type { Instruction, InstructionsPaginatedResponse } from "../models/instruction"

export interface InstructionsRepository {
  getAllInstructions(): Promise<Instruction[]>
  getInstructionsByType(type: "group" | "branch"): Promise<Instruction[]>
  getInstructionsByYear(year: string): Promise<Instruction[]>
  getInstructionsByTypeAndYear(type: "group" | "branch", year: string): Promise<Instruction | null>
  getYearsByType(type: "group" | "branch"): Promise<string[]>
  getInstructionsByYearId(yearId: string, page?: number, pageSize?: number): Promise<InstructionsPaginatedResponse>
  getInstructionById(id: string): Promise<Instruction | null>
}
