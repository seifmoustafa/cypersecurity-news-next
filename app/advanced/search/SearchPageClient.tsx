"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Pagination } from "@/components/ui/pagination"
import { Search, ArrowLeft, Calendar, Tag, ExternalLink, Clock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearch } from "@/core/hooks/use-search"
import type { SearchResult, SearchResponse } from "@/core/services/search-service"


const ENTITY_TYPE_LABELS: Record<string, string> = {
  News: "news",
  Law: "laws",
  Standard: "standards",
  StandardCategory: "standards",
  Regulation: "regulation",
  RegulationCategory: "regulation",
  Article: "articles",
  Instruction: "instructions",
  InstructionCategory: "instructions",
  Definition: "definitions",
  DefinitionCategory: "definitions",
  Video: "media",
  Presentation: "media",
  Lecture: "media",
  HelperSystem: "systems",
  MainSystem: "systems",
  Awareness: "awareness",
  AwarenessYear: "awareness",
  PersonalProtectCategory: "personalProtect",
  Procedure: "procedures",
  ProcedureControl: "procedures",
  ProcedureSafeguard: "procedures",
  ProcedureTechnique: "procedures",
  ProcedureImplementationStep: "procedures",
}

export default function SearchPageClient() {
  const { t, isRtl } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<string | null>(searchParams.get("filter") || null)
  
  const debouncedQuery = useDebounce(query, 500)
  const { search, loading, error, results } = useSearch()

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery, 1)
      setCurrentPage(1)
    }
  }, [debouncedQuery, search])

  // Update URL when query or filter changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) {
      params.set("q", query)
    }
    if (activeFilter) {
      params.set("filter", activeFilter)
    }
    const newUrl = query ? `/search?${params.toString()}` : "/search"
    router.replace(newUrl, { scroll: false })
  }, [query, activeFilter, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      search(query.trim(), 1)
      setCurrentPage(1)
    }
  }

  const handlePageChange = (page: number) => {
    if (query.trim()) {
      search(query.trim(), page)
      setCurrentPage(page)
    }
  }

  const handleFilterClick = (entityType: string) => {
    if (activeFilter === entityType) {
      // If clicking the same filter, clear it
      setActiveFilter(null)
    } else {
      // Set new filter
      setActiveFilter(entityType)
    }
    setCurrentPage(1)
  }

  const clearFilter = () => {
    setActiveFilter(null)
    setCurrentPage(1)
  }

  // Get filtered results based on active filter
  const getFilteredResults = () => {
    if (!results) return []
    
    if (activeFilter) {
      // Use resultsByType if available, otherwise filter allResults
      return results.resultsByType[activeFilter] || results.allResults.filter(result => result.entityType === activeFilter)
    }
    
    return results.allResults
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getEntityTypeLabel = (entityType: string) => {
    return ENTITY_TYPE_LABELS[entityType] || entityType.toLowerCase()
  }

  const renderSearchResult = (result: SearchResult) => (
    <Card key={result.id} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl hover:from-card/90 hover:via-card/70 hover:to-card/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      {/* Animated border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row">
        {/* Image Section - Only show if image exists, exactly like news cards */}
        {result.imageUrl && (
          <div className="md:w-56 w-full h-48 relative overflow-hidden">
            <Image
              src={result.imageUrl}
              alt={result.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            {/* Image overlay badge */}
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-primary text-white border-0 shadow-lg backdrop-blur-sm font-semibold">
                {t(`section.${getEntityTypeLabel(result.entityType)}`)}
              </Badge>
            </div>
            
            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg line-clamp-1">{result.title}</h3>
            </div>
          </div>
        )}
        
        {/* Content Section */}
        <div className="flex-1 p-8">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-4">
              {!result.imageUrl && (
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-primary text-white border-0 shadow-md font-semibold">
                    {t(`section.${getEntityTypeLabel(result.entityType)}`)}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    {formatDate(result.createdTimestamp)}
                  </div>
                </div>
              )}
              
              {/* Only show title in content if no image */}
              {!result.imageUrl && (
                <CardTitle className="text-2xl font-bold leading-tight mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-cyan-500 transition-all duration-300">
                  {result.title}
                </CardTitle>
              )}
              
              {result.titleEn && (
                <p className="text-base text-muted-foreground mb-4 font-medium">
                  {result.titleEn}
                </p>
              )}
            </div>
            
            {/* Summary */}
            {(result.summary || result.summaryEn) && (
              <div className="flex-1 mb-6">
                {result.summary && (
                  <div 
                    className="text-base text-muted-foreground line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: result.summary }}
                  />
                )}
                {result.summaryEn && (
                  <div className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
                    {result.summaryEn}
                  </div>
                )}
              </div>
            )}
            
            {/* Highlights */}
            {result.highlights.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-cyan-500 rounded-full" />
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    {t("common.highlights")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {result.highlights.slice(0, 4).map((highlight, index) => (
                    <Badge 
                      key={index} 
                      className="text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200 px-3 py-1 font-medium"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gradient-to-r from-border/50 via-border/30 to-border/50">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{t(`section.${getEntityTypeLabel(result.entityType)}`)}</span>
                </div>
              </div>
              
              <Link href={result.navigationRoute}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 px-6 py-3"
                >
                  <span className="font-semibold">{t("common.readMore")}</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700" />
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-cyan-500">
                {t("common.search")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("common.searchDescription")}
              </p>
            </div>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("common.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                  "pl-14 pr-4 py-5 text-lg border-2 focus:border-primary transition-all duration-200 rounded-xl shadow-sm focus:shadow-md",
                  isRtl && "text-right"
                )}
                autoFocus
              />
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              {t("common.searching")}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => search(query, currentPage)}>
              {t("common.retry")}
            </Button>
          </div>
        )}

        {/* No Query State */}
        {!query && !loading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t("common.searchPlaceholder")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("common.searchDescription")}
            </p>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="relative overflow-hidden bg-gradient-to-br from-card/40 via-card/30 to-card/20 backdrop-blur-xl rounded-3xl p-8 border border-border/30 shadow-xl">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full translate-y-16 -translate-x-16" />
              
              <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-cyan-500 bg-clip-text text-transparent">
                       {activeFilter 
                         ? t("common.foundResults").replace("{{count}}", String(getFilteredResults().length)).replace("{{term}}", results.metadata.query)
                         : t("common.foundResults").replace("{{count}}", String(results.metadata.totalResults)).replace("{{term}}", results.metadata.query)
                       }
                     </h2>
                     <p className="text-base text-muted-foreground mt-2 flex items-center gap-2">
                       <Clock className="h-4 w-4" />
                       {t("common.searchTime").replace("{{time}}", String(results.metadata.executionTimeMs))}
                     </p>
                     {activeFilter && (
                       <div className="mt-3 flex items-center gap-2">
                         <Badge className="bg-primary text-white border-0 font-semibold">
                           {t(`section.${getEntityTypeLabel(activeFilter)}`)}
                         </Badge>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={clearFilter}
                           className="text-muted-foreground hover:text-foreground text-sm"
                         >
                           ✕ {t("common.clearFilter")}
                         </Button>
                       </div>
                     )}
                   </div>
                 </div>
                
                {/* Entity Type Filters */}
                {results.metadata.entityTypesWithResultsList.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    <span className="text-base font-semibold text-foreground self-center flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-cyan-500 rounded-full" />
                      {t("common.filterBy")}:
                    </span>
                     {results.metadata.entityTypesWithResultsList.map((type) => (
                       <Badge 
                         key={type} 
                         onClick={() => handleFilterClick(type)}
                         className={cn(
                           "text-sm border transition-all duration-200 px-4 py-2 cursor-pointer font-medium",
                           activeFilter === type
                             ? "bg-primary text-white border-primary shadow-lg"
                             : "bg-primary/20 text-primary border-primary/40 hover:bg-primary/30 hover:border-primary/60"
                         )}
                       >
                         {t(`section.${getEntityTypeLabel(type)}`)}
                       </Badge>
                     ))}
                  </div>
                )}
              </div>
            </div>

             {/* Results List */}
             {getFilteredResults().length > 0 ? (
               <div className="space-y-6">
                 {getFilteredResults().map(renderSearchResult)}
               </div>
             ) : (
              <div className="relative overflow-hidden text-center py-20 bg-gradient-to-br from-card/30 via-card/20 to-card/10 backdrop-blur-xl rounded-3xl border border-border/30 shadow-xl">
                {/* Decorative elements */}
                <div className="absolute top-0 left-1/2 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 -translate-x-16" />
                <div className="absolute bottom-0 right-1/2 w-24 h-24 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full translate-y-12 translate-x-12" />
                
                 <div className="relative z-10">
                   <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full mb-8">
                     <Search className="h-10 w-10 text-primary" />
                   </div>
                   <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
                     {activeFilter ? t("common.noFilteredResults") : t("common.noSearchResults")}
                   </h3>
                   <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                     {activeFilter ? t("common.tryDifferentFilter") : t("common.tryDifferentSearch")}
                   </p>
                   {activeFilter && (
                     <Button
                       variant="outline"
                       onClick={clearFilter}
                       className="mt-4"
                     >
                       {t("common.clearFilter")}
                     </Button>
                   )}
                 </div>
              </div>
            )}

            {/* Pagination */}
            {results.pagination.pagesCount > 1 && (
              <div className="flex justify-center pt-8">
                <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={results.pagination.pagesCount}
                    onPageChange={handlePageChange}
                    showFirstLast={true}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
