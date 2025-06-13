export interface RegulationCategory {
  id: string
  name: string
  name_En: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface RegulationCategoriesResponse {
  data: RegulationCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
