export interface Law {
  id: string
  title: string
  content: string
  jurisdiction: string
  titleEn: string
  contentEn: string
  summary: string
  summaryEn: string
  enactmentDate: string
  issueDate: string
  effectiveDate: string
  documentUrl?: string
  tags: string[]
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface LawsPaginatedResponse {
  data: Law[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
