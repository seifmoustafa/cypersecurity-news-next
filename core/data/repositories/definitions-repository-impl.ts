import type { DefinitionsRepository } from "../../domain/repositories/definitions-repository"
import type {
  Definition,
  DefinitionCategory,
  DefinitionsPaginatedResponse,
  DefinitionCategoriesPaginatedResponse,
} from "../../domain/models/definition"
import type { ApiDataSource } from "../sources/api-data-source"
import { slugify } from "../../../lib/utils"

export class DefinitionsRepositoryImpl implements DefinitionsRepository {
  private dataSource: ApiDataSource

  constructor(dataSource: ApiDataSource) {
    this.dataSource = dataSource
  }

  async getAllDefinitions(): Promise<Definition[]> {
    try {
      // Get all categories first, then get definitions for each category
      const categoriesResponse = await this.getAllCategories(1, 100)
      const allDefinitions: Definition[] = []

      for (const category of categoriesResponse.data) {
        const definitionsResponse = await this.getDefinitionsByCategory(category.id, 1, 100)
        allDefinitions.push(...definitionsResponse.data)
      }

      return allDefinitions
    } catch (error) {
      console.error("Error fetching all definitions:", error)
      return []
    }
  }

  async getDefinitionById(id: string): Promise<Definition | null> {
    try {
      const definition = await this.dataSource.get<Definition>(`/Definitions/${id}`)
      return definition
    } catch (error) {
      console.error(`Error fetching definition ${id}:`, error)
      return null
    }
  }

  async getDefinitionsByCategory(categoryId: string, page = 1, pageSize = 10): Promise<DefinitionsPaginatedResponse> {
    try {
      const response = await this.dataSource.get<DefinitionsPaginatedResponse>(
        `/Definitions/by-category/${categoryId}?page=${page}&pageSize=${pageSize}`,
      )
      return response
    } catch (error) {
      console.error(`Error fetching definitions for category ${categoryId}:`, error)
      return {
        data: [],
        pagination: {
          itemsCount: 0,
          pagesCount: 0,
          pageSize,
          currentPage: page,
        },
      }
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await this.getAllCategories(1, 100)
      return response.data.map((category) => category.id)
    } catch (error) {
      console.error("Error fetching definition categories:", error)
      return []
    }
  }

  async getAllCategories(page = 1, pageSize = 10): Promise<DefinitionCategoriesPaginatedResponse> {
    try {
      const response = await this.dataSource.get<DefinitionCategoriesPaginatedResponse>(
        `/DefinitionCategories?page=${page}&pageSize=${pageSize}`,
      )
      return response
    } catch (error) {
      console.error("Error fetching definition categories:", error)
      return {
        data: [],
        pagination: {
          itemsCount: 0,
          pagesCount: 0,
          pageSize,
          currentPage: page,
        },
      }
    }
  }

  async getCategoryById(id: string): Promise<DefinitionCategory | null> {
    try {
      const category = await this.dataSource.get<DefinitionCategory>(`/DefinitionCategories/${id}`)
      return category
    } catch (error) {
      console.error(`Error fetching definition category ${id}:`, error)
      return null
    }
  }

  async getDefinitionBySlug(slug: string): Promise<Definition | null> {
    try {
      // Since we can't get all definitions directly, we need to search through categories
      // This is a workaround - in a real app, you'd want a search endpoint
      const categoriesResponse = await this.getAllCategories(1, 100)

      for (const category of categoriesResponse.data) {
        const definitionsResponse = await this.getDefinitionsByCategory(category.id, 1, 100)

        const foundDefinition = definitionsResponse.data.find((definition) => {
          const englishTerm = definition.termEn || definition.term || ""
          const definitionSlug = slugify(englishTerm, definition.id)
          return definitionSlug === slug
        })

        if (foundDefinition) {
          return foundDefinition
        }
      }

      return null
    } catch (error) {
      console.error(`Error finding definition by slug ${slug}:`, error)
      return null
    }
  }

  async getCategoryBySlug(slug: string): Promise<DefinitionCategory | null> {
    try {
      const response = await this.getAllCategories(1, 100)
      const foundCategory = response.data.find((category) => {
        const englishName = category.nameEn || category.name || ""
        const categorySlug = slugify(englishName, category.id)
        return categorySlug === slug
      })

      return foundCategory || null
    } catch (error) {
      console.error(`Error finding definition category by slug ${slug}:`, error)
      return null
    }
  }
}
