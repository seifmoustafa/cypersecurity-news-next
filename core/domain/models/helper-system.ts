export interface HelperSystem {
  id: string
  name: string
  summary: string
  iconUrl: string
  downloadUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface HelperSystemsResponse {
  data: HelperSystem[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
