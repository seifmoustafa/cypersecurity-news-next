export interface Instruction {
  id: string
  type: "group" | "branch"
  year: string
  content: {
    en: string
    ar: string
  }
  documentUrl?: string
}
