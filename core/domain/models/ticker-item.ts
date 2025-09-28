export interface TickerItem {
  id: string
  title: string
  titleEn?: string | null
  subtitle?: string | null
  subtitleEn?: string | null
  summary?: string | null
  summaryEn?: string | null
  type?: "info" | "warning" | "alert"
  text?: {
    en: string
    ar: string
  }
}
