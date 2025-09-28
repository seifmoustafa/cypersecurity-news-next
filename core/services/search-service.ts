export interface SearchResult {
  id: string
  entityType: string
  hierarchyPath: string[]
  navigationRoute: string
  title: string
  titleEn: string | null
  summary: string | null
  summaryEn: string | null
  category: {
    id: string
    name: string
    nameEn: string | null
    categoryType: string | null
  } | null
  imageUrl: string | null
  createdTimestamp: string
  relevanceScore: number
  highlights: string[]
  tags: string[]
}

export interface SearchResponse {
  resultsByType: Record<string, SearchResult[]>
  allResults: SearchResult[]
  pagination: {
    itemsCount: number
    pagesCount: number
    pageSize: number
    currentPage: number
  }
  metadata: {
    query: string
    totalResults: number
    entityTypesWithResults: number
    executionTimeMs: number
    searchedEntityTypes: string[]
    entityTypesWithResultsList: string[]
  }
}

export class SearchService {
  private baseUrl: string
  private baseImageUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
    this.baseImageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
    
    if (!this.baseUrl) {
      console.error("No API base URL configured for search")
    }
  }

  async search(
    query: string,
    page: number = 1,
    pageSize: number = 10,
    includeInactive: boolean = false,
    englishOnly: boolean = false,
    arabicOnly: boolean = false
  ): Promise<SearchResponse> {
    try {
      console.log(`🔍 Searching for: "${query}" - page: ${page}, pageSize: ${pageSize}`)

      // Build query parameters
      const params = new URLSearchParams({
        query: query.trim(),
        page: page.toString(),
        pageSize: pageSize.toString(),
        includeInactive: includeInactive.toString(),
        englishOnly: englishOnly.toString(),
        arabicOnly: arabicOnly.toString(),
      })

      const url = `${this.baseUrl}/Search/beginners?${params.toString()}`
      console.log(`📡 Search API Request:`, url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json() as SearchResponse
      console.log(`✅ Search completed in ${data.metadata.executionTimeMs}ms - Found ${data.metadata.totalResults} results`)
      
      // Transform image URLs to remove /api prefix and add base image URL
      const transformedData = this.transformSearchResults(data)
      
      return transformedData
    } catch (error) {
      console.error("❌ Search API Error:", error)
      throw error
    }
  }

  private transformSearchResults(data: SearchResponse): SearchResponse {
    return {
      ...data,
      allResults: data.allResults.map(result => ({
        ...result,
        imageUrl: result.imageUrl ? `${this.baseImageUrl}${result.imageUrl}` : null,
        navigationRoute: this.transformNavigationRoute(result.navigationRoute, result.entityType)
      })),
      resultsByType: Object.fromEntries(
        Object.entries(data.resultsByType).map(([key, results]) => [
          key,
          results.map(result => ({
            ...result,
            imageUrl: result.imageUrl ? `${this.baseImageUrl}${result.imageUrl}` : null,
            navigationRoute: this.transformNavigationRoute(result.navigationRoute, result.entityType)
          }))
        ])
      )
    }
  }

  private transformNavigationRoute(route: string, entityType: string): string {
    // Transform definition routes to use the new structure
    if (entityType === "Definition") {
      // Handle different definition route patterns
      if (route.includes("/simple/definitions/")) {
        // Extract definition ID from /simple/definitions/[id]
        const definitionId = route.replace("/simple/definitions/", "")
        return `/simple/definitions-categories/definition/${definitionId}`
      } else if (route.includes("/simple/definitions-categories/definition/")) {
        // Handle paths like /simple/definitions-categories/definition/categoryId/definitionId
        const pathParts = route.split("/")
        const definitionIndex = pathParts.indexOf("definition")
        if (definitionIndex !== -1 && pathParts.length > definitionIndex + 2) {
          // Extract categoryId and definitionId
          const categoryId = pathParts[definitionIndex + 1]
          const definitionId = pathParts[definitionIndex + 2]
          return `/simple/definitions-categories/${categoryId}/${definitionId}`
        }
      }
    }
    return route
  }
}
