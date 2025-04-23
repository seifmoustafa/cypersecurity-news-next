export interface Law {
  id: string
  title: {
    en: string
    ar: string
  }
  category: string
  description: {
    en: string
    ar: string
  }
  content: {
    en: string
    ar: string
  }
  publishDate: string
  documentUrl?: string
}

export interface LawCategory {
  id: string
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
}
