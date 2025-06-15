export interface Article {
  id: string
  title: string
  titleEn: string | null
  content: string
  contentEn: string | null
  summary: string | null
  summaryEn: string | null
  imageUrl: string | null
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ArticleResponse {
  data: Article[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface LatestArticle {
  id: string
  title: string
  titleEn: string | null
  content: string
  contentEn: string | null
  summary: string | null
  summaryEn: string | null
  imageUrl: string | null
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}
