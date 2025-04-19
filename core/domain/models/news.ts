import type { Article } from "./article"

export interface News extends Article {
  featured: boolean
  source?: string
}
