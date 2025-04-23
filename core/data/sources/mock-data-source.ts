import type { News } from "../../domain/models/news"
import type { Standard, StandardCategory, Control } from "../../domain/models/standard"
import type { Instruction } from "../../domain/models/instruction"
import type { Definition } from "../../domain/models/definition"
import type { Framework, Domain } from "../../domain/models/framework"
import type { System } from "../../domain/models/system"
import type { Regulation } from "../../domain/models/regulation"
import type { Video, Lecture, Presentation } from "../../domain/models/media"
import type { TickerItem } from "../../domain/models/ticker-item"
import type { Tip } from "../../domain/models/tip"
import type { Component } from "../../domain/models/component"

// Import mock data
import { newsData, getNewsByCategory, getNewsById, getLatestNews } from "@/data/news-data"
import { standardsData } from "@/data/standards-data"
import { internationalStandardsData, iso27001Controls } from "@/data/standards-hierarchy-data"
import { instructionsData } from "@/data/instructions-data"
import { definitionsData, getDefinitionById, getDefinitionsByCategory } from "@/data/definitions-data"
import { frameworkData } from "@/data/standards-hierarchy-data"
import { systemsData } from "@/data/systems-data"
import { regulationData } from "@/data/regulation-data"
import { mediaLibraryData } from "@/data/media-library-data"
import { tickerItems } from "@/data/ticker-items"
import { tips } from "@/data/tips"

export class MockDataSource {
  // News
  async getAllNews(): Promise<News[]> {
    return newsData
  }

  async getNewsById(id: string): Promise<News | null> {
    return getNewsById(id)
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    return getNewsByCategory(category)
  }

  async getLatestNews(count: number): Promise<News[]> {
    return getLatestNews(count)
  }

  async getFeaturedNews(): Promise<News[]> {
    return newsData.filter((news) => news.featured)
  }

  // Standards
  async getAllStandards(): Promise<Standard[]> {
    return internationalStandardsData
  }

  async getStandardById(id: string): Promise<Standard | null> {
    return internationalStandardsData.find((standard) => standard.id === id) || null
  }

  async getStandardsByCategory(category: string): Promise<Standard[]> {
    if (category === "international") {
      return internationalStandardsData
    }
    return []
  }

  async getStandardCategories(): Promise<StandardCategory[]> {
    return Object.keys(standardsData).map((key) => ({
      id: key,
      name: {
        en: standardsData[key].title?.en || key,
        ar: standardsData[key].title?.ar || key,
      },
      description: {
        en: standardsData[key].description?.match(/<p>(.*?)<\/p>/)?.[1] || "",
        ar: standardsData[key].description?.replace(/<p>.*?<\/p>/g, "").replace(/<\/?[^>]+(>|$)/g, "") || "",
      },
      items: standardsData[key].items,
    }))
  }

  async getStandardCategoryById(id: string): Promise<StandardCategory | null> {
    if (!standardsData[id]) return null

    return {
      id,
      name: {
        en: standardsData[id].title?.en || id,
        ar: standardsData[id].title?.ar || id,
      },
      description: {
        en: standardsData[id].description?.match(/<p>(.*?)<\/p>/)?.[1] || "",
        ar: standardsData[id].description?.replace(/<p>.*?<\/p>/g, "").replace(/<\/?[^>]+(>|$)/g, "") || "",
      },
      items: standardsData[id].items,
    }
  }

  async getControlsByStandardId(standardId: string): Promise<Control[]> {
    if (standardId === "iso-27001") {
      return iso27001Controls
    }
    return []
  }

  async getControlById(standardId: string, controlId: string): Promise<Control | null> {
    if (standardId === "iso-27001") {
      return iso27001Controls.find((control) => control.id === controlId) || null
    }
    return null
  }

  // Instructions
  async getAllInstructions(): Promise<Instruction[]> {
    const result: Instruction[] = []

    Object.keys(instructionsData).forEach((type) => {
      Object.keys(instructionsData[type]).forEach((year) => {
        result.push({
          id: `${type}-${year}`,
          type: type as "group" | "branch",
          year,
          content: {
            en: instructionsData[type][year].en,
            ar: instructionsData[type][year].ar,
          },
          documentUrl: instructionsData[type][year].documentUrl,
        })
      })
    })

    return result
  }

  async getInstructionsByType(type: "group" | "branch"): Promise<Instruction[]> {
    const result: Instruction[] = []

    Object.keys(instructionsData[type]).forEach((year) => {
      result.push({
        id: `${type}-${year}`,
        type,
        year,
        content: {
          en: instructionsData[type][year].en,
          ar: instructionsData[type][year].ar,
        },
        documentUrl: instructionsData[type][year].documentUrl,
      })
    })

    return result
  }

  async getInstructionsByYear(year: string): Promise<Instruction[]> {
    const result: Instruction[] = []

    Object.keys(instructionsData).forEach((type) => {
      if (instructionsData[type][year]) {
        result.push({
          id: `${type}-${year}`,
          type: type as "group" | "branch",
          year,
          content: {
            en: instructionsData[type][year].en,
            ar: instructionsData[type][year].ar,
          },
          documentUrl: instructionsData[type][year].documentUrl,
        })
      }
    })

    return result
  }

  async getInstructionsByTypeAndYear(type: "group" | "branch", year: string): Promise<Instruction | null> {
    if (!instructionsData[type] || !instructionsData[type][year]) {
      return null
    }

    return {
      id: `${type}-${year}`,
      type,
      year,
      content: {
        en: instructionsData[type][year].en,
        ar: instructionsData[type][year].ar,
      },
      documentUrl: instructionsData[type][year].documentUrl,
    }
  }

  async getYearsByType(type: "group" | "branch"): Promise<string[]> {
    return Object.keys(instructionsData[type]).sort((a, b) => Number(b) - Number(a))
  }

  // Definitions
  async getAllDefinitions(): Promise<Definition[]> {
    const result: Definition[] = []

    Object.keys(definitionsData).forEach((category) => {
      definitionsData[category].forEach((def) => {
        result.push({
          ...def,
          category,
        })
      })
    })

    return result
  }

  async getDefinitionById(id: string): Promise<Definition | null> {
    const def = getDefinitionById(id)
    if (!def) return null

    // Find the category
    let category = ""
    Object.keys(definitionsData).forEach((cat) => {
      if (definitionsData[cat].some((d) => d.id === id)) {
        category = cat
      }
    })

    return {
      ...def,
      category,
    }
  }

  async getDefinitionsByCategory(category: string): Promise<Definition[]> {
    return getDefinitionsByCategory(category).map((def) => ({
      ...def,
      category,
    }))
  }

  async getCategories(): Promise<string[]> {
    return Object.keys(definitionsData)
  }

  // Framework
  async getFramework(): Promise<Framework> {
    return frameworkData
  }

  async getDomains(): Promise<Domain[]> {
    return frameworkData.domains
  }

  async getDomainById(id: string): Promise<Domain | null> {
    return frameworkData.domains.find((domain) => domain.id === id) || null
  }

  async getComponentsByDomainId(domainId: string): Promise<Component[]> {
    const domain = frameworkData.domains.find((domain) => domain.id === domainId)
    return domain ? domain.components : []
  }

  // Systems
  async getAllSystems(): Promise<System[]> {
    return systemsData
  }

  async getSystemById(id: string): Promise<System | null> {
    return systemsData.find((system) => system.id === id) || null
  }

  // Regulations
  getAllRegulations(): Regulation[] {
    return regulationData
  }

  getRegulationById(id: string | number): Regulation | null {
    const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id
    return regulationData.find((regulation) => regulation.id === numericId) || null
  }

  // Media
  async getAllVideos(): Promise<Video[]> {
    return mediaLibraryData.videos
  }

  async getVideoById(id: string): Promise<Video | null> {
    return mediaLibraryData.videos.find((video) => video.id === id) || null
  }

  async getAllLectures(): Promise<Lecture[]> {
    return mediaLibraryData.lectures
  }

  async getLectureById(id: string): Promise<Lecture | null> {
    return mediaLibraryData.lectures.find((lecture) => lecture.id === id) || null
  }

  async getAllPresentations(): Promise<Presentation[]> {
    return mediaLibraryData.presentations
  }

  async getPresentationById(id: string): Promise<Presentation | null> {
    return mediaLibraryData.presentations.find((presentation) => presentation.id === id) || null
  }

  // Ticker
  async getTickerItems(): Promise<TickerItem[]> {
    // Convert the old format to the new format
    const items: TickerItem[] = []

    if (tickerItems && tickerItems.ar && tickerItems.en) {
      // Assuming tickerItems is in the old format { ar: string[], en: string[] }
      for (let i = 0; i < tickerItems.ar.length; i++) {
        items.push({
          id: `ticker-${i}`,
          type: i % 3 === 0 ? "alert" : i % 2 === 0 ? "warning" : "info",
          text: {
            ar: tickerItems.ar[i],
            en: tickerItems.en[i < tickerItems.en.length ? i : 0],
          },
        })
      }
    }

    return items
  }

  // Tips
  async getAllTips(): Promise<Tip[]> {
    return tips
  }

  async getRandomTip(): Promise<Tip> {
    const randomIndex = Math.floor(Math.random() * tips.length)
    return tips[randomIndex]
  }
}
