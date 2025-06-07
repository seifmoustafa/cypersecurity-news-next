export interface NewsCategory {
  id: string
  name: string
  nameEn: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface NewsCategoriesResponse {
  data: NewsCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
