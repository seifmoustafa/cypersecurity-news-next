// Base interfaces for API responses
export interface PaginatedSecurityProcedureResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    pageSize: number
    totalCount: number
    hasPrevious: boolean
    hasNext: boolean
  }
}

export interface SingleSecurityProcedureResponse<T> {
  data: T
}

// Security Procedure Standard
export interface SecurityProcedureStandard {
  id: string
  standardName: string
  nameEn: string
  standardDescription: string
  descriptionEn: string
  approval: boolean
  approvalDate: string | null
  online: boolean
  configuration: boolean
  createdDate: string
  updatedDate: string
}

// Security Procedure Control
export interface SecurityProcedureControl {
  id: string
  nameEn: string
  control: {
    id: string
    controlName: string
    nameEn: string
    controlDescription: string
    descriptionEn: string
    approval: boolean
    approvalDate: string | null
    online: boolean
    configuration: boolean
    createdDate: string
    updatedDate: string
  }
}

// Security Procedure Safeguard
export interface SecurityProcedureSafeguard {
  id: string
  safeGuardName: string
  nameEn: string
  safeGuardDescription: string
  descriptionEn: string
  approval: boolean
  approvalDate: string | null
  online: boolean
  configuration: boolean
  createdDate: string
  updatedDate: string
}

// Security Procedure Technique
export interface SecurityProcedureTechnique {
  id: string
  nameEn: string
  technique: {
    id: string
    techniqueName: string
    nameEn: string
    techniqueDescription: string
    descriptionEn: string
    approval: boolean
    approvalDate: string | null
    online: boolean
    configuration: boolean
    createdDate: string
    updatedDate: string
  }
}

// Security Procedure Implementation Step
export interface SecurityProcedureImplementationStep {
  id: string
  nameEn: string
  implementationStep: {
    id: string
    implementationStepName: string
    nameEn: string
    implementationStepDescription: string
    descriptionEn: string
    approval: boolean
    approvalDate: string | null
    online: boolean
    configuration: boolean
    createdDate: string
    updatedDate: string
  }
}
