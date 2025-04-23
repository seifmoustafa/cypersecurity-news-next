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
  type?: "videos" | "lectures" | "presentations"
}

export interface Video extends MediaItem {
  url: string
  type: "videos"
}

export interface Lecture extends MediaItem {
  content: {
    en: string
    ar: string
  }
  documentUrl?: string
  type: "lectures"
}

export interface Presentation extends MediaItem {
  slides: Slide[]
  type: "presentations"
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
