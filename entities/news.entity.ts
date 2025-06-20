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
  imageUrl?: string | null
}

export interface NewsCategory {
  id: string
  name: string
  nameEn: string
  description?: string
  descriptionEn?: string
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
