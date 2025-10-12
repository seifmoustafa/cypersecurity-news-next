"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, BookOpen, Download, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { getLocalizedText, slugify } from "@/lib/utils"
import type { ApiLecture, LecturesPaginatedResponse, LectureCategory } from "@/core/domain/models/media"
import Link from "next/link"

interface LectureCategoryPageClientProps {
  initialLectures: LecturesPaginatedResponse
  initialSearch: string
  initialPage: number
  category: LectureCategory
}

export default function LectureCategoryPageClient({ 
  initialLectures, 
  initialSearch, 
  initialPage,
  category 
}: LectureCategoryPageClientProps) {
  const { language, isRtl } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [lectures, setLectures] = useState<ApiLecture[]>(initialLectures.data || [])
  const [pagination, setPagination] = useState(initialLectures.pagination)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  // State to track if initial data has been processed
  const [initialDataProcessed, setInitialDataProcessed] = useState(false)

  const getDisplayName = (lecture: ApiLecture) => {
    return language === "ar" ? lecture.nameAr || lecture.nameEn || "" : lecture.nameEn || lecture.nameAr || ""
  }

  const getDisplaySummary = (lecture: ApiLecture) => {
    return language === "ar"
      ? lecture.summaryAr || lecture.summaryEn || ""
      : lecture.summaryEn || lecture.summaryAr || ""
  }

  const getDocumentUrl = (lecture: ApiLecture) => {
    if (!lecture.documentUrl) return null
    return lecture.documentUrl.startsWith("http")
      ? lecture.documentUrl
      : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""}${lecture.documentUrl}`
  }

  const fetchLectures = useCallback(async (page: number, search: string) => {
    try {
      setLoading(true)
      const response = await container.services.media.getLecturesByCategoryForProfessionals(category.id, page, 12, search)
      setLectures(response.data || [])
      setPagination(response.pagination)
    } catch (error) {
      console.error("Error fetching lectures:", error)
      setLectures([])
      setPagination({ itemsCount: 0, pagesCount: 0, pageSize: 12, currentPage: page })
    } finally {
      setLoading(false)
    }
  }, [category.id])

  const updateURL = useCallback(
    (search: string, page: number) => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (page > 1) params.set("page", page.toString())

      const queryString = params.toString()
      const newURL = queryString ? `/advanced/lectures/${category.id}?${queryString}` : `/advanced/lectures/${category.id}`
      router.push(newURL, { scroll: false })
    },
    [router, category.id],
  )

  // Effect to handle URL parameter changes
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const page = Number(searchParams.get('page')) || 1
    
    // Always update state when URL parameters change
    if (search !== searchTerm) {
      setSearchTerm(search)
      // Fetch lectures when search term changes
      fetchLectures(page, search)
    }
    
    if (page !== currentPage) {
      setCurrentPage(page)
      // Fetch lectures when page changes
      fetchLectures(page, search)
    }
  }, [searchParams, fetchLectures, currentPage, searchTerm])

  // Effect to handle category changes (when navigating between categories)
  useEffect(() => {
    // Reset to first page when category changes
    setCurrentPage(1)
    setSearchTerm("")
    fetchLectures(1, "")
    updateURL("", 1)
  }, [category.id, fetchLectures, updateURL])

  // Effect to handle initial data when component mounts or receives new props
  useEffect(() => {
    // Update state with initial data when component mounts
    setLectures(initialLectures.data || [])
    setPagination(initialLectures.pagination)
    setSearchTerm(initialSearch)
    setCurrentPage(initialPage)
  }, [initialLectures, initialSearch, initialPage])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== initialSearch || currentPage !== initialPage) {
        setCurrentPage(1)
        fetchLectures(1, searchTerm)
        updateURL(searchTerm, 1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, fetchLectures, updateURL, initialSearch, initialPage, currentPage, searchParams])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchLectures(page, searchTerm)
    updateURL(searchTerm, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDownload = (lecture: ApiLecture) => {
    const documentUrl = getDocumentUrl(lecture)
    if (documentUrl) {
      const link = document.createElement("a")
      link.href = documentUrl
      link.download = `${getDisplayName(lecture) || "lecture"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const categoryName = language === "ar" ? category.name : category.nameEn || category.name

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
                onClick={() => router.push("/advanced#media")}
                className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <ArrowLeft className="h-4 w-4" />
                {language === "ar" ? "العودة للمكتبة" : "Back to Media"}
              </Button>
            </div>

            <div className={`text-center ${isRtl ? "text-right" : "text-left"}`}>
              <h1 className={`text-4xl font-bold mb-4 ${isRtl ? "text-right" : "text-left"}`}>
                <BookOpen className="inline-block mr-3 h-8 w-8 text-primary" />
                {categoryName}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === "ar"
                  ? `${pagination.itemsCount} محاضرة متاحة`
                  : `${pagination.itemsCount} lectures available`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRtl ? "right-3" : "left-3"}`} />
              <Input
                type="text"
                placeholder={language === "ar" ? "البحث في المحاضرات..." : "Search lectures..."}
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
          ) : lectures.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm
                  ? language === "ar"
                    ? "لا توجد نتائج"
                    : "No results found"
                  : language === "ar"
                    ? "لا توجد محاضرات"
                    : "No lectures available"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? language === "ar"
                    ? "جرب البحث بكلمات مختلفة"
                    : "Try searching with different terms"
                  : language === "ar"
                    ? "لم يتم العثور على محاضرات"
                    : "No lectures found"}
              </p>
            </div>
          ) : (
            <>
              {/* Lectures Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {lectures.map((lecture) => (
                  <Card key={lecture.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors ${isRtl ? "text-right" : "text-left"}`}
                          >
                            {getDisplayName(lecture)}
                          </h3>
                          <p
                            className={`text-muted-foreground text-sm line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                          >
                            {getDisplaySummary(lecture)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/advanced/lectures/${category.id}/${lecture.id}`}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            {language === "ar" ? "عرض" : "View"}
                          </Button>
                        </Link>
                        {lecture.documentUrl && (
                          <Button
                            size="sm"
                            onClick={() => handleDownload(lecture)}
                            className="flex items-center gap-1"
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
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    {language === "ar" ? "السابق" : "Previous"}
                  </Button>
                  
                  <span className="text-sm text-muted-foreground px-4">
                    {language === "ar"
                      ? `الصفحة ${currentPage} من ${pagination.pagesCount}`
                      : `Page ${currentPage} of ${pagination.pagesCount}`}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.min(pagination.pagesCount, currentPage + 1))}
                    disabled={currentPage === pagination.pagesCount}
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