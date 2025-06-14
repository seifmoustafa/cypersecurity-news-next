export interface Instruction {
  id: string
  title: string
  titleEn: string
  content: string
  contentEn: string
  summary: string
  summaryEn: string
  imageUrl: string | null
  documentUrl: string | null
  publishDate: string
  yearId: string
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface InstructionsPaginatedResponse {
  data: Instruction[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
