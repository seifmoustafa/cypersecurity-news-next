import type { Law, LawCategory } from "../models/law"

export interface LawsRepository {
  getAllLaws(): Promise<Law[]>
  getLawById(id: string): Promise<Law | null>
  getLawsByCategory(category: string): Promise<Law[]>
  getLawCategories(): Promise<LawCategory[]>
}
