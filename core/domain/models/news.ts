export interface News {
  id: string
  title: string
  titleEn: string | null
  content: string
  contentEn: string | null
  summary: string | null
  summaryEn: string | null
  imageUrl: string | null
  date: string | null
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  // Additional properties from API
  categoryId?: string
  forBeginners?: boolean
  forProfessionals?: boolean
  order?: number
  // For UI compatibility
  category?: string
  featured?: boolean
  source?: string
}

export interface NewsResponse {
  data: News[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface LatestNews {
  id: string
  title: string
  titleEn: string | null
  content: string
  contentEn: string | null
  summary: string | null
  summaryEn: string | null
  imageUrl: string | null
  date: string
  tags: string[]
  forBeginners: boolean
  forProfessionals: boolean
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface NewsCategory {
  id: string
  name: string
  nameEn: string | null
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface NewsCategoriesResponse {
  data: NewsCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

// Re-export from centralized entities
export * from "../../../entities/news.entity"
