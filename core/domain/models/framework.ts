export interface Framework {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  version: string
}

export interface FrameworkFunction {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  color: string
  order: number
}

export interface FrameworkCategory {
  id: string
  functionId: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  order: number
}

export interface Domain {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  order: number
}

export interface Component {
  id: string
  domainId: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  order: number
}
