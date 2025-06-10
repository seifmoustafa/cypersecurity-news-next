import type { HelperSystem, HelperSystemsResponse } from "../models/helper-system"

export interface HelperSystemsRepository {
  getHelperSystems(page?: number, pageSize?: number): Promise<HelperSystemsResponse>
  getHelperSystemById(id: string): Promise<HelperSystem | null>
}
