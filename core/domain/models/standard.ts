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
  standardId: string
  code: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

// Add pagination response for controls
export interface ControlsPaginatedResponse {
  data: Control[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

// Safeguard interface matching API response
export interface Safeguard {
  id: string
  controlId: string
  code: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

// Add pagination response for safeguards
export interface SafeguardsPaginatedResponse {
  data: Safeguard[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

// New Technique interface matching API response
export interface Technique {
  id: string
  code: string
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  safeguardId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

// Add pagination response for techniques
export interface TechniquesPaginatedResponse {
  data: Technique[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

// New ImplementationStep interface matching API response
export interface ImplementationStep {
  id: string
  orderNum: number
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  techniqueId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

// Add pagination response for implementation steps
export interface ImplementationStepsPaginatedResponse {
  data: ImplementationStep[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
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
