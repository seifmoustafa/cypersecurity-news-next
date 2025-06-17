export interface Awareness {
  id: string
  title: string
  titleEn?: string
  summary: string
  summaryEn?: string
  content: string
  contentEn?: string
  documentUrl?: string // Added for PDF documents
  isActive: boolean
  createdAt: string
  updatedAt?: string | null
  yearId: string
  year: number
}

export interface AwarenessYear {
  id: string
  year: number
  isActive: boolean
  createdAt: string
  updatedAt?: string | null
}

export interface AwarenessResponse {
  data: Awareness[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface AwarenessYearResponse {
  data: AwarenessYear[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
