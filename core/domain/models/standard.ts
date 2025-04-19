export interface Standard {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  organization: {
    en: string
    ar: string
  }
  year: string
  imageUrl: string
  documentUrl?: string
}

export interface StandardCategory {
  id: string
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  items: StandardItem[]
}

export interface StandardItem {
  id: string
  name: string
  description: string
}

export interface Control {
  id: string
  code: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
}

export interface Safeguard {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
}

export interface Technique {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
}

export interface Implementation {
  id: string
  title: {
    en: string
    ar: string
  }
  content: {
    en: string
    ar: string
  }
}
