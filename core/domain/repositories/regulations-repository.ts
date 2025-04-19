import type { Regulation } from "../models/regulation"

export interface RegulationsRepository {
  getAllRegulations(): Promise<Regulation[]>
  getRegulationById(id: string): Promise<Regulation | null>
}
