export interface Tip {
  id: string
  title: string
  titleEn: string
  subtitle: string
  subtitleEn: string
  summary: string
  summaryEn: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface TipResponse {
  id: string
  title: string
  titleEn: string
  subtitle: string
  subtitleEn: string
  summary: string
  summaryEn: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}
