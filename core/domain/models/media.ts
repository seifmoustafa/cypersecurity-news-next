export interface MediaItem {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  thumbnailUrl: string
  type?: "videos" | "lectures" | "presentations"
}

export interface Video extends MediaItem {
  url: string
  type: "videos"
}

export interface ApiVideo {
  id: string
  nameEn: string
  nameAr: string
  summaryEn: string
  summaryAr: string
  videoUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface VideosPaginatedResponse {
  data: ApiVideo[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface Lecture extends MediaItem {
  content: {
    en: string
    ar: string
  }
  documentUrl?: string
  type: "lectures"
}

export interface Presentation extends MediaItem {
  slides: Slide[]
  type: "presentations"
}

export interface Slide {
  id: string
  imageUrl: string
  title?: {
    en: string
    ar: string
  }
  content?: {
    en: string
    ar: string
  }
}
