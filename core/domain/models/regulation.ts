export interface Regulation {
  id: string
  title: {
    en: string
    ar: string
  }
  shortDescription: {
    en: string
    ar: string
  }
  fullDescription: {
    en: string
    ar: string
  }
  imageUrl: string
  documentUrl?: string
}
