export interface InstructionCategory {
  id: string
  name: string
  nameEn: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface InstructionCategoriesResponse {
  data: InstructionCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
