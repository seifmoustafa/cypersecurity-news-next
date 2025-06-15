export interface System {
  id: string
  name: string
  summary: string
  imageUrl: string | null
  navigationUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface SystemsPaginatedResponse {
  data: System[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
