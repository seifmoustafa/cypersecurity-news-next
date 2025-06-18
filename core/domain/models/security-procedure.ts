// Base interface for common fields
interface BaseSecurityProcedureEntity {
  id: string
  nameEn: string
  descriptionEn: string | null
  isActive: boolean
  isDeleted: boolean
  order: number
  createdTimestamp: string
  updatedTimestamp: string | null
  deletedTimestamp: string | null
}

// Security Procedure Standard
export interface SecurityProcedureStandard extends BaseSecurityProcedureEntity {
  standardName: string
  standardDescription: string
  standardAbbreviation: string
  standardVersion: number
}

// Security Procedure Control (from StandardControl endpoint)
export interface SecurityProcedureControl extends BaseSecurityProcedureEntity {
  standardControlName: string
  control: {
    id: string
    controlTitle: string
    controlDescription: string
    nameEn: string
    descriptionEn: string
    weight: number
    online: boolean
    order: number
    isActive: boolean
    isDeleted: boolean
    createdTimestamp: string
    updatedTimestamp: string | null
    deletedTimestamp: string | null
  }
  standard: SecurityProcedureStandard
}

// Security Procedure Safeguard
export interface SecurityProcedureSafeguard extends BaseSecurityProcedureEntity {
  safeGuardTitle: string
  safeGuardDescription: string
  mandatory: boolean
  mandatoryEvidence: boolean
  configurable: boolean
  configurationScore: number
  online: boolean
  control?: {
    id: string
    controlTitle: string
    controlDescription: string
    nameEn: string
    descriptionEn: string
    weight: number
    online: boolean
    order: number
    isActive: boolean
    isDeleted: boolean
    createdTimestamp: string
    updatedTimestamp: string | null
    deletedTimestamp: string | null
  }
  assetType?: {
    id: string
    assetTypeTitle: string
    assetTypeDescription: string
    nameEn: string
    descriptionEn: string
    approval: boolean
    approvalDate: string
    isActive: boolean
    isDeleted: boolean
    order: number
    createdTimestamp: string
    updatedTimestamp: string | null
    deletedTimestamp: string | null
  }
  securityFunction?: {
    id: string
    securityFunctionTitle: string
    securityFunctionDescription: string
    nameEn: string
    descriptionEn: string
    approval: boolean
    approvalDate: string
    isActive: boolean
    isDeleted: boolean
    order: number
    createdTimestamp: string
    updatedTimestamp: string | null
    deletedTimestamp: string | null
  }
}

// Security Procedure Technique (from SafeguardTechnique endpoint)
export interface SecurityProcedureTechnique extends BaseSecurityProcedureEntity {
  safeGuard: SecurityProcedureSafeguard
  technique: {
    id: string
    techniqueName: string
    techniqueDescription: string
    nameEn: string
    descriptionEn: string
    approval: boolean
    approvalDate: string
    online: boolean
    isActive: boolean
    isDeleted: boolean
    order: number
    createdTimestamp: string
    updatedTimestamp: string | null
    deletedTimestamp: string | null
  }
}

// Security Procedure Implementation Step
export interface SecurityProcedureImplementationStep extends BaseSecurityProcedureEntity {
  technique: {
    id: string
    techniqueName: string
    techniqueDescription: string
    nameEn: string
    descriptionEn: string
    approval: boolean
    approvalDate: string
    online: boolean
    isActive: boolean
    isDeleted: boolean
    order: number
    createdTimestamp: string
    updatedTimestamp: string | null
    deletedTimestamp: string | null
  }
  implementationStep: {
    id: string
    implementationStepName: string
    implementationStepDescription: string
    nameEn: string
    descriptionEn: string
    approval: boolean
    configuration: boolean
    approvalDate: string
    online: boolean
    isActive: boolean
    isDeleted: boolean
    order: number
    createdTimestamp: string
    updatedTimestamp: string | null
    deletedTimestamp: string | null
  }
}

// API Response interfaces
export interface PaginatedSecurityProcedureResponse<T> {
  statusCode: number
  message: string
  data: T[]
  errors: any
  pagination: {
    itemsCount: number
    pageSize: number
    currentPage: number
  }
}

export interface SingleSecurityProcedureResponse<T> {
  statusCode: number
  message: string
  data: T
  errors: any
  pagination: {
    itemsCount: number
    pageSize: number
    currentPage: number
  }
}
