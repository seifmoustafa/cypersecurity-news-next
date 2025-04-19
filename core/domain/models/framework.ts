export interface Framework {
  id: string
  domains: Domain[]
}

export interface Domain {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  components: Component[]
}

export interface Component {
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
