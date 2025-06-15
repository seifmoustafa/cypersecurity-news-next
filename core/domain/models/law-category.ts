export interface LawCategory {
  id: string
  name: string
  nameEn: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface LawCategoriesPaginatedResponse {
  data: LawCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
