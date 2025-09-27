export interface Definition {
  id: string
  term: string
  definitionText: string
  source: string
  termEn: string
  definitionEn: string
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface DefinitionCategory {
  id: string
  name: string
  nameEn: string | null
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface DefinitionsPaginatedResponse {
  data: Definition[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface DefinitionCategoriesPaginatedResponse {
  data: DefinitionCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
