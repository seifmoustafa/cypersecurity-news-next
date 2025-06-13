export interface InstructionYear {
  id: string
  year: number
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface InstructionYearsResponse {
  data: InstructionYear[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
