"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Presentation, Download, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { getLocalizedText } from "@/lib/utils"
import type { ApiPresentation, PresentationsPaginatedResponse } from "@/core/domain/models/media"
import Link from "next/link"

interface PresentationsPageClientProps {
  initialPresentations?: PresentationsPaginatedResponse
  initialSearch?: string
  initialPage?: number
}

export default function PresentationsPageClient({
  initialPresentations,
  initialSearch = "",
  initialPage = 1,
}: PresentationsPageClientProps) {
  const { language, isRtl } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [presentations, setPresentations] = useState<ApiPresentation[]>(initialPresentations?.data || [])
  const [pagination, setPagination] = useState(
    initialPresentations?.pagination || {
      itemsCount: 0,
      pagesCount: 0,
      pageSize: 12,
      currentPage: 1,
    },
  )
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)

  const getDisplayName = (presentation: ApiPresentation) => {
    return language === "ar"
      ? presentation.nameAr || presentation.nameEn || ""
      : presentation.nameEn || presentation.nameAr || ""
  }

  const getDisplaySummary = (presentation: ApiPresentation) => {
    return language === "ar"
      ? presentation.summaryAr || presentation.summaryEn || ""
      : presentation.summaryEn || presentation.summaryAr || ""
  }

  const getPresentationUrl = (presentation: ApiPresentation) => {
    if (!presentation.presentationUrl) return null
    return presentation.presentationUrl.startsWith("http")
      ? presentation.presentationUrl
      : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""}${presentation.presentationUrl}`
  }

  const fetchPresentations = useCallback(async (page: number, search: string) => {
    try {
      setLoading(true)
      const response = await container.services.media.getPresentations(page, 12, search)
      setPresentations(response.data || [])
      setPagination(response.pagination)
    } catch (error) {
      console.error("Error fetching presentations:", error)
      setPresentations([])
      setPagination({ itemsCount: 0, pagesCount: 0, pageSize: 12, currentPage: page })
    } finally {
      setLoading(false)
    }
  }, [])

  const updateURL = useCallback(
    (search: string, page: number) => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (page > 1) params.set("page", page.toString())

      const queryString = params.toString()
      const newURL = queryString ? `/advanced/presentations?${queryString}` : "/advanced/presentations"
      router.push(newURL, { scroll: false })
    },
    [router],
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== initialSearch || currentPage !== initialPage) {
        setCurrentPage(1)
        fetchPresentations(1, searchTerm)
        updateURL(searchTerm, 1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, fetchPresentations, updateURL, initialSearch, initialPage, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchPresentations(page, searchTerm)
    updateURL(searchTerm, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDownload = (presentation: ApiPresentation) => {
    const presentationUrl = getPresentationUrl(presentation)
    if (presentationUrl) {
      const link = document.createElement("a")
      link.href = presentationUrl
      link.download = `${getDisplayName(presentation) || "presentation"}.pptx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/#media")}
                className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <ArrowLeft className="h-4 w-4" />
                {language === "ar" ? "العودة للمكتبة" : "Back to Media"}
              </Button>
            </div>

            <div className={`text-center ${isRtl ? "text-right" : "text-left"}`}>
              <h1 className={`text-4xl font-bold mb-4 ${isRtl ? "text-right" : "text-left"}`}>
                <Presentation className="inline-block mr-3 h-8 w-8 text-primary" />
                {language === "ar" ? "العروض التقديمية" : "Presentations"}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === "ar"
                  ? `${pagination.itemsCount} عرض تقديمي متاح`
                  : `${pagination.itemsCount} presentations available`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRtl ? "right-3" : "left-3"}`} />
              <Input
                type="text"
                placeholder={language === "ar" ? "البحث في العروض التقديمية..." : "Search presentations..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isRtl ? "pr-10 text-right" : "pl-10"}`}
                dir={isRtl ? "rtl" : "ltr"}
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : presentations.length === 0 ? (
            <div className="text-center py-12">
              <Presentation className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm
                  ? language === "ar"
                    ? "لا توجد نتائج"
                    : "No results found"
                  : language === "ar"
                    ? "لا توجد عروض تقديمية"
                    : "No presentations available"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? language === "ar"
                    ? "جرب البحث بكلمات مختلفة"
                    : "Try searching with different terms"
                  : language === "ar"
                    ? "لم يتم العثور على عروض تقديمية"
                    : "No presentations found"}
              </p>
            </div>
          ) : (
            <>
              {/* Presentations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {presentations.map((presentation) => (
                  <Card
                    key={presentation.id}
                    className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Presentation className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors ${isRtl ? "text-right" : "text-left"}`}
                          >
                            {getDisplayName(presentation)}
                          </h3>
                          <p
                            className={`text-muted-foreground text-sm line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                          >
                            {getDisplaySummary(presentation)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/advanced/presentations/${presentation.id}`}>
                            {language === "ar" ? "عرض التفاصيل" : "View Details"}
                          </Link>
                        </Button>

                        {presentation.presentationUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(presentation)}
                            className="px-3"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pagesCount > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    {language === "ar" ? "السابق" : "Previous"}
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.pagesCount) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.pagesCount}
                  >
                    {language === "ar" ? "التالي" : "Next"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
