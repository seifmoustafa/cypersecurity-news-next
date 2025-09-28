export interface Reference {
  id: string
  title: string
  titleEn: string | null
  description: string
  descriptionEn: string | null
  summary: string
  summaryEn: string | null
  pdfUrl: string
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ReferenceResponse {
  data: Reference[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
