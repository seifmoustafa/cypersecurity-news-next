import type { System } from "../models/system"

export interface SystemsRepository {
  getAllSystems(): Promise<System[]>
  getSystemById(id: string): Promise<System | null>
}
