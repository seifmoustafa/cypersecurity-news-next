export interface Procedure {
  id: string
  nameEn: string | null
  nameAr: string | null
  descriptionEn: string | null
  descriptionAr: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ProceduresPaginatedResponse {
  data: Procedure[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface ProcedureControl {
  id: string
  code: string
  nameEn: string | null
  nameAr: string | null
  descriptionEn: string | null
  descriptionAr: string | null
  procedureId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ProcedureControlsPaginatedResponse {
  data: ProcedureControl[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface ProcedureSafeguard {
  id: string
  code: string
  nameEn: string | null
  nameAr: string | null
  descriptionEn: string | null
  descriptionAr: string | null
  procedureControlId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ProcedureSafeguardsPaginatedResponse {
  data: ProcedureSafeguard[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface ProcedureTechnique {
  id: string
  code: string
  nameEn: string | null
  nameAr: string | null
  descriptionEn: string | null
  descriptionAr: string | null
  procedureSafeguardId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ProcedureTechniquesPaginatedResponse {
  data: ProcedureTechnique[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}

export interface ProcedureImplementationStep {
  id: string
  orderNum: number
  nameEn: string | null
  nameAr: string | null
  descriptionEn: string | null
  descriptionAr: string | null
  imageUrl: string | null
  documentUrl: string | null
  procedureTechniqueId: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface ProcedureImplementationStepsPaginatedResponse {
  data: ProcedureImplementationStep[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
}
