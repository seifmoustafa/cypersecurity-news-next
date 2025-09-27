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
  nameEn: string | null
  nameAr: string
  summaryEn: string | null
  summaryAr: string
  videoUrl: string
  imageUrl: string
  videoCategoryId: string
  videoCategoryName: string | null
  videoCategoryNameEn: string | null
  forBeginners: boolean
  forProfessionals: boolean
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

export interface ApiLecture {
  id: string
  nameEn: string | null
  nameAr: string
  summaryEn: string | null
  summaryAr: string
  contentEn: string | null
  contentAr: string
  documentUrl: string
  lectureCategoryId: string
  lectureCategoryName: string | null
  lectureCategoryNameEn: string | null
  forBeginners: boolean
  forProfessionals: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface LecturesPaginatedResponse {
  data: ApiLecture[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface ApiPresentation {
  id: string
  nameEn: string | null
  nameAr: string
  summaryEn: string | null
  summaryAr: string
  presentationUrl: string
  presentationCategoryId: string
  presentationCategoryName: string | null
  presentationCategoryNameEn: string | null
  forBeginners: boolean
  forProfessionals: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PresentationsPaginatedResponse {
  data: ApiPresentation[]
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

// Category interfaces
export interface VideoCategory {
  id: string
  name: string
  nameEn: string | null
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface VideoCategoriesResponse {
  data: VideoCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface LectureCategory {
  id: string
  name: string
  nameEn: string | null
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface LectureCategoriesResponse {
  data: LectureCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface PresentationCategory {
  id: string
  name: string
  nameEn: string | null
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PresentationCategoriesResponse {
  data: PresentationCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}