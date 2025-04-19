export interface MediaItem {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  thumbnailUrl: string
}

export interface Video extends MediaItem {
  url: string
}

export interface Lecture extends MediaItem {
  content: {
    en: string
    ar: string
  }
  documentUrl?: string
}

export interface Presentation extends MediaItem {
  slides: Slide[]
}

export interface Slide {
  id: string
  imageUrl: string
  title?: {
    en: string
    ar: string
  }
  content?: {
    en: string
    ar: string
  }
}
