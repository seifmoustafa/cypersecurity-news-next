export interface Tip {
  id: string
  title: string
  titleEn: string | null
  subtitle: string
  subtitleEn: string | null
  summary: string
  summaryEn: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface TipResponse {
  id: string
  title: string
  titleEn: string | null
  subtitle: string
  subtitleEn: string | null
  summary: string
  summaryEn: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}
