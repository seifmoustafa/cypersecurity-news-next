export interface TickerItem {
  id: string
  type: "info" | "warning" | "alert"
  text: {
    en: string
    ar: string
  }
}
