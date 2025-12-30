"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { ApiLecture, LectureCategory } from "@/core/domain/models/media"
import { BookOpen, ArrowRight, ArrowLeft, Search, X, Download, FileText } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"

export default function LectureCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
      const resolvedParams = use(params)
      const { language, isRtl } = useLanguage()
      const [lectures, setLectures] = useState<ApiLecture[]>([])
      const [category, setCategory] = useState<LectureCategory | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [searchQuery, setSearchQuery] = useState("")
      const debouncedSearch = useDebounce(searchQuery, 500)
      const [currentPage, setCurrentPage] = useState(1)
      const [totalPages, setTotalPages] = useState(1)
      const pageSize = 12

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        setError(null)

                        // Fetch all categories to find the current one
                        const categoriesResponse = await container.services.media.getLectureCategoriesForProfessionals(1, 100)
                        const foundCategory = categoriesResponse.data.find((cat: LectureCategory) => cat.id === resolvedParams.categoryId)
                        if (foundCategory) {
                              setCategory(foundCategory)
                        }

                        // Fetch lectures for this category
                        const lecturesResponse = await container.services.media.getLecturesByCategoryForProfessionals(
                              resolvedParams.categoryId,
                              currentPage,
                              pageSize,
                              debouncedSearch
                        )
                        setLectures(lecturesResponse.data)
                        setTotalPages(lecturesResponse.pagination.pagesCount)
                  } catch (err) {
                        console.error("Error fetching lectures:", err)
                        setError(language === "ar" ? "حدث خطأ في تحميل المحاضرات" : "Error loading lectures")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.categoryId, currentPage, debouncedSearch, language])

      const getDocumentUrl = (lecture: ApiLecture) => {
            if (!lecture.documentUrl) return null
            return lecture.documentUrl.startsWith("http")
                  ? lecture.documentUrl
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""}${lecture.documentUrl}`
      }

      const handleDownload = (lecture: ApiLecture) => {
            const documentUrl = getDocumentUrl(lecture)
            if (documentUrl) {
                  const link = document.createElement("a")
                  link.href = documentUrl
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
            }
      }

      const categoryName = category
            ? (language === "ar" ? category.name : category.nameEn || category.name)
            : (language === "ar" ? "محاضرات" : "Lectures")

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "المحاضرات" : "Lectures", href: "/advanced/lectures" },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                          {Array.from({ length: 8 }).map((_, i) => (
                                                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      if (error) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "المحاضرات" : "Lectures", href: "/advanced/lectures" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />
                              <div className="text-center py-16">
                                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">{error}</p>
                                    <Button onClick={() => window.location.reload()} className="mt-4">
                                          {language === "ar" ? "إعادة المحاولة" : "Retry"}
                                    </Button>
                              </div>
                        </div>
                  </div>
            )
      }

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                              { label: language === "ar" ? "المحاضرات" : "Lectures", href: "/advanced/lectures" },
                              { label: categoryName }
                        ]} />

                        {/* Page Header */}
                        <div className="mt-8 mb-8">
                              <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                                          <BookOpen className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                                {categoryName}
                                          </h1>
                                          <p className="text-gray-600 dark:text-gray-400">
                                                {language === "ar"
                                                      ? `${lectures.length} محاضرة متاحة`
                                                      : `${lectures.length} lectures available`}
                                          </p>
                                    </div>
                              </div>
                        </div>

                        {/* Search Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8 max-w-2xl">
                              <div className="flex items-center gap-4" dir={isRtl ? "rtl" : "ltr"}>
                                    <div className="relative flex-1">
                                          <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRtl ? "right-3" : "left-3"}`} />
                                          <input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={language === "ar" ? "ابحث في المحاضرات..." : "Search lectures..."}
                                                className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white`}
                                          />
                                          {searchQuery && (
                                                <button
                                                      onClick={() => setSearchQuery("")}
                                                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRtl ? "left-3" : "right-3"}`}
                                                >
                                                      <X className="h-5 w-5" />
                                                </button>
                                          )}
                                    </div>
                              </div>
                        </div>

                        {/* Lectures Grid */}
                        {lectures.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" dir={isRtl ? "rtl" : "ltr"}>
                                    {lectures.map((lecture) => (
                                          <Card key={lecture.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                                                <CardContent className="p-6">
                                                      <div className="flex items-start gap-3 mb-4">
                                                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                                                                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                                                        {language === "ar" ? lecture.nameAr : lecture.nameEn || lecture.nameAr}
                                                                  </h3>
                                                                  <p className="text-muted-foreground text-sm line-clamp-3">
                                                                        {language === "ar" ? lecture.summaryAr : lecture.summaryEn || lecture.summaryAr}
                                                                  </p>
                                                            </div>
                                                      </div>

                                                      <div className="flex gap-2">
                                                            <Link
                                                                  href={`/advanced/lectures/${resolvedParams.categoryId}/${lecture.id}`}
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
                                                                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                                                                  >
                                                                        <Download className="h-4 w-4" />
                                                                  </Button>
                                                            )}
                                                      </div>
                                                </CardContent>
                                          </Card>
                                    ))}
                              </div>
                        ) : (
                              <div className="text-center py-16">
                                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {debouncedSearch
                                                ? (language === "ar" ? "لا توجد محاضرات تطابق البحث" : "No lectures match your search")
                                                : (language === "ar" ? "لا توجد محاضرات متاحة" : "No lectures available")}
                                    </p>
                              </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                              <div className="flex justify-center gap-2 mt-8">
                                    <Button
                                          variant="outline"
                                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                          disabled={currentPage === 1}
                                    >
                                          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                                          <span className={isRtl ? "mr-2" : "ml-2"}>
                                                {language === "ar" ? "السابق" : "Previous"}
                                          </span>
                                    </Button>
                                    <span className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border">
                                          {language === "ar"
                                                ? `${currentPage} من ${totalPages}`
                                                : `${currentPage} / ${totalPages}`}
                                    </span>
                                    <Button
                                          variant="outline"
                                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                          disabled={currentPage === totalPages}
                                    >
                                          <span className={isRtl ? "ml-2" : "mr-2"}>
                                                {language === "ar" ? "التالي" : "Next"}
                                          </span>
                                          {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                                    </Button>
                              </div>
                        )}
                  </div>
            </div>
      )
}
