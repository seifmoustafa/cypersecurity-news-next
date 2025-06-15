import type { System, SystemsPaginatedResponse } from "../models/system"

export interface SystemsRepository {
  getAllSystems(page?: number, pageSize?: number, search?: string): Promise<SystemsPaginatedResponse>
  getSystemById(id: string): Promise<System | null>
}
