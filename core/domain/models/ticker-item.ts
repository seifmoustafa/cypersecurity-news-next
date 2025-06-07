export interface TickerItem {
  id: string
  title: string
  titleEn?: string | null
  type?: "info" | "warning" | "alert"
  text?: {
    en: string
    ar: string
  }
}
