export interface Standard {
  id: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  category: StandardCategory
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface StandardCategory {
  id: string
  nameEn: string
  nameAr: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface StandardsPaginatedResponse {
  data: Standard[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface StandardCategoriesPaginatedResponse {
  data: StandardCategory[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

// Legacy interfaces for backward compatibility
export interface StandardItem {
  id: string
  name: string
  description: string
}

export interface Control {
  id: string
  code: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
}

export interface Safeguard {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
}

export interface Technique {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
}

export interface Implementation {
  id: string
  title: {
    en: string
    ar: string
  }
  content: {
    en: string
    ar: string
  }
}
