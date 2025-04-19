export interface Article {
  id: string
  title: {
    en: string
    ar: string
  }
  summary: {
    en: string
    ar: string
  }
  content: {
    en: string
    ar: string
  }
  imageUrl: string
  date: string
  category: string
  tags: string[]
}
