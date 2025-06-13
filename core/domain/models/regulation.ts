export interface Regulation {
  id: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  summary: string
  summaryEn: string
  issueDate: string
  effectiveDate: string
  documentUrl: string
  imageUrl: string
  regulationCategoryId: string
  categoryName: string
  categoryNameEn: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface RegulationsResponse {
  data: Regulation[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
