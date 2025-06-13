import type { Regulation, RegulationsResponse } from "../models/regulation"

export interface RegulationsRepository {
  getAllRegulations(page?: number, pageSize?: number): Promise<RegulationsResponse>
  getRegulationsByCategory(categoryId: string, page?: number, pageSize?: number): Promise<RegulationsResponse>
  getRegulationById(id: string): Promise<Regulation | null>
  getRegulationBySlug(slug: string): Promise<Regulation | null>
}
