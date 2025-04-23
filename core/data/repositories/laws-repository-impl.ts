import type { LawsRepository } from "../../domain/repositories/laws-repository"
import type { Law, LawCategory } from "../../domain/models/law"
import type { MockDataSource } from "../sources/mock-data-source"

export class LawsRepositoryImpl implements LawsRepository {
  private dataSource: MockDataSource

  constructor(dataSource: MockDataSource) {
    this.dataSource = dataSource
  }

  async getAllLaws(): Promise<Law[]> {
    return this.dataSource.getAllLaws()
  }

  async getLawById(id: string): Promise<Law | null> {
    try {
      const allLaws = await this.dataSource.getAllLaws()
      const law = allLaws.find((law) => law.id === id)
      return law || null
    } catch (error) {
      console.error(`Error fetching law with ID ${id}:`, error)
      return null
    }
  }

  async getLawsByCategory(category: string): Promise<Law[]> {
    try {
      const allLaws = await this.dataSource.getAllLaws()
      return allLaws.filter((law) => law.category === category)
    } catch (error) {
      console.error(`Error fetching laws for category ${category}:`, error)
      return []
    }
  }

  async getLawCategories(): Promise<LawCategory[]> {
    return this.dataSource.getLawCategories()
  }
}
