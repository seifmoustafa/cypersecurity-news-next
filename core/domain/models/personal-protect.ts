export interface PersonalProtectCategory {
  id: string
  name: string | null
  nameEn: string | null
  description: string | null
  descriptionEn: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PersonalProtectSubCategory {
  id: string
  name: string | null
  nameEn: string | null
  description: string | null
  descriptionEn: string | null
  personalProtectCategoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PersonalProtectControl {
  id: string
  name: string | null
  nameEn: string | null
  description: string | null
  descriptionEn: string | null
  imageUrl: string | null
  personalProtectSubCategoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PersonalProtectControlStep {
  id: string
  name: string | null
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

// Paginated response types
export interface PersonalProtectCategoriesPaginatedResponse {
  data: PersonalProtectCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface PersonalProtectSubCategoriesPaginatedResponse {
  data: PersonalProtectSubCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface PersonalProtectControlsPaginatedResponse {
  data: PersonalProtectControl[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface PersonalProtectControlStepsPaginatedResponse {
  data: PersonalProtectControlStep[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
