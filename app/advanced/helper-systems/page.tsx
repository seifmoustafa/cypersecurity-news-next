"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { HelperSystem, HelperSystemsResponse } from "@/core/domain/models/helper-system"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Search, ArrowLeft, ArrowRight, X, Wrench, Package } from "lucide-react"
import Image from "next/image"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { useDebounce } from "@/hooks/use-debounce"

export default function HelperSystemsPage() {
      const { language, isRtl } = useLanguage()
      const [helperSystems, setHelperSystems] = useState<HelperSystem[]>([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [searchQuery, setSearchQuery] = useState("")
      const debouncedSearch = useDebounce(searchQuery, 500)
      const [currentPage, setCurrentPage] = useState(1)
      const [totalPages, setTotalPages] = useState(1)
      const pageSize = 12

      useEffect(() => {
            const fetchHelperSystems = async () => {
                  try {
                        setLoading(true)
                        setError(null)
                        const response = await container.services.helperSystems.getHelperSystems(
                              currentPage,
                              pageSize,
                              debouncedSearch
                        )
                        setHelperSystems(response.data || [])
                        setTotalPages(response.pagination.pagesCount)
                  } catch (err) {
                        console.error("Error fetching helper systems:", err)
                        setError(language === "ar" ? "حدث خطأ في تحميل الأنظمة المساعدة" : "Error loading helper systems")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchHelperSystems()
      }, [currentPage, debouncedSearch, language])

      const handleDownload = (downloadUrl: string, name: string) => {
            if (!downloadUrl) return
            const link = document.createElement("a")
            link.href = downloadUrl
            link.rel = "noopener"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
      }

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems" }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                          {Array.from({ length: 8 }).map((_, i) => (
                                                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
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
                                    { label: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems" }
                              ]} />
                              <div className="text-center py-16">
                                    <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                              { label: language === "ar" ? "الأنظمة المساعدة" : "Helper Systems" }
                        ]} />

                        {/* Page Header */}
                        <div className="mt-8 mb-8 text-center">
                              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6 shadow-lg shadow-orange-500/30">
                                    <Wrench className="h-10 w-10 text-white" />
                              </div>
                              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {language === "ar" ? "الأنظمة المساعدة" : "Helper Systems"}
                              </h1>
                              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    {language === "ar"
                                          ? "تصفح وتحميل جميع الأنظمة المساعدة المتاحة"
                                          : "Browse and download all available helper systems"}
                              </p>
                        </div>

                        {/* Search Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8 max-w-2xl mx-auto">
                              <div className="flex items-center gap-4" dir={isRtl ? "rtl" : "ltr"}>
                                    <div className="relative flex-1">
                                          <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRtl ? "right-3" : "left-3"}`} />
                                          <input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={language === "ar" ? "ابحث في الأنظمة المساعدة..." : "Search helper systems..."}
                                                className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white`}
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

                        {/* Helper Systems Grid */}
                        {helperSystems.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" dir={isRtl ? "rtl" : "ltr"}>
                                    {helperSystems.map((system) => {
                                          if (!system || !system.id) return null

                                          return (
                                                <Card
                                                      key={system.id}
                                                      className="group hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden border-2 border-slate-200 dark:border-slate-700"
                                                >
                                                      <CardContent className="p-6">
                                                            {/* Icon/Image */}
                                                            <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                                                                  {system.iconUrl ? (
                                                                        <Image
                                                                              src={system.iconUrl}
                                                                              alt={system.name}
                                                                              fill
                                                                              className="object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                                                                              onError={(e) => {
                                                                                    const target = e.target as HTMLImageElement
                                                                                    target.style.display = 'none'
                                                                              }}
                                                                        />
                                                                  ) : (
                                                                        <Package className="h-16 w-16 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                                                                  )}
                                                            </div>

                                                            {/* Name */}
                                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                                                                  {system.name}
                                                            </h3>

                                                            {/* Summary */}
                                                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
                                                                  {system.summary}
                                                            </p>

                                                            {/* Download Button */}
                                                            <Button
                                                                  onClick={() => handleDownload(system.downloadUrl, system.name)}
                                                                  disabled={!system.downloadUrl}
                                                                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white gap-2"
                                                            >
                                                                  <Download className="w-4 h-4" />
                                                                  {language === "ar" ? "تحميل" : "Download"}
                                                            </Button>
                                                      </CardContent>
                                                </Card>
                                          )
                                    })}
                              </div>
                        ) : (
                              <div className="text-center py-16">
                                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {debouncedSearch
                                                ? (language === "ar" ? "لا توجد نتائج للبحث" : "No search results found")
                                                : (language === "ar" ? "لا توجد أنظمة مساعدة متاحة" : "No helper systems available")}
                                    </p>
                              </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                              <div className="flex justify-center items-center gap-4 mt-8">
                                    <Button
                                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                          disabled={currentPage === 1}
                                          variant="outline"
                                          className="gap-2"
                                    >
                                          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                                          {language === "ar" ? "السابق" : "Previous"}
                                    </Button>

                                    <span className="text-gray-700 dark:text-gray-300 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border">
                                          {language === "ar"
                                                ? `${currentPage} من ${totalPages}`
                                                : `${currentPage} / ${totalPages}`}
                                    </span>

                                    <Button
                                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                          disabled={currentPage === totalPages}
                                          variant="outline"
                                          className="gap-2"
                                    >
                                          {language === "ar" ? "التالي" : "Next"}
                                          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                    </Button>
                              </div>
                        )}
                  </div>
            </div>
      )
}
