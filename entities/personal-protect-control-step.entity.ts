export interface PersonalProtectControlStep {
  id: string
  name: string
  nameEn: string | null
  summary: string | null
  summaryEn: string | null
  content: string | null
  contentEn: string | null
  order: number
  imageUrl: string | null
  videoUrl: string | null
  documentUrl: string | null
  personalProtectControlId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PersonalProtectControlStepsResponse {
  data: PersonalProtectControlStep[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
