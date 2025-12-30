"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { AwarenessResponse } from "@/core/domain/models/awareness"
import { FileText, Calendar, TrendingUp, Sparkles, Search } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import Link from "next/link"

export default function AwarenessPage() {
      const { language, isRtl } = useLanguage()
      const currentYear = new Date().getFullYear()
      const [data, setData] = useState<AwarenessResponse | null>(null)
      const [loading, setLoading] = useState(true)
      const [searchQuery, setSearchQuery] = useState("")

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        const response = await container.services.awareness.getCurrentYearAwareness("", 1, 100)
                        setData(response)
                  } catch (error) {
                        console.error("❌ Error fetching awareness data:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [])

      const filteredItems = data?.data.filter(item => {
            const title = language === "ar" ? item.title : (item.titleEn || item.title)
            return title?.toLowerCase().includes(searchQuery.toLowerCase())
      }) || []

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[{ label: language === "ar" ? "التوعية" : "Awareness" }]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs: Home > Awareness */}
                        <AdvancedBreadcrumbs items={[{ label: language === "ar" ? "التوعية" : "Awareness" }]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
                                    <FileText className="h-8 w-8 text-white" />
                              </div>

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {language === "ar" ? `نشرات التوعية ${currentYear}` : `Awareness Bulletins ${currentYear}`}
                              </h1>

                              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                                    {language === "ar"
                                          ? "تصفح أحدث نشرات التوعية الأمنية والإرشادات"
                                          : "Browse latest security awareness bulletins and guidelines"}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                {language === "ar" ? `${filteredItems.length} نشرة متاحة` : `${filteredItems.length} bulletins available`}
                                          </span>
                                    </div>

                                    <Link
                                          href="/advanced/awareness/years"
                                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                                    >
                                          <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                                {language === "ar" ? "عرض جميع السنوات" : "View All Years"}
                                          </span>
                                    </Link>
                              </div>
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                              <div className="relative max-w-md">
                                    <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                          type="text"
                                          value={searchQuery}
                                          onChange={(e) => setSearchQuery(e.target.value)}
                                          placeholder={language === "ar" ? "ابحث في النشرات..." : "Search bulletins..."}
                                          className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                              </div>
                        </div>

                        {/* Bulletins Grid */}
                        {filteredItems.length === 0 ? (
                              <div className="text-center py-16">
                                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {searchQuery
                                                ? (language === "ar" ? "لا توجد نتائج للبحث" : "No search results")
                                                : (language === "ar" ? "لا توجد نشرات متاحة" : "No bulletins available")
                                          }
                                    </p>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredItems.map((item) => (
                                          <AwarenessCard key={item.id} item={item} year={currentYear.toString()} language={language} isRtl={isRtl} />
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      )
}

function AwarenessCard({ item, year, language, isRtl }: { item: any; year: string; language: string; isRtl: boolean }) {
      const title = language === "ar" ? item.title : (item.titleEn || item.title)
      const summary = language === "ar" ? item.summary : (item.summaryEn || item.summary)

      const cleanSummary = (summary || "").replace(/<\/?[^>]+(>|$)/g, "").trim()

      return (
            <Link href={`/advanced/awareness/${year}/${item.id}`} className="group">
                  <article className="h-full bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 p-6">
                        {/* Icon & Year Badge */}
                        <div className="flex items-start justify-between mb-6">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <FileText className="h-6 w-6 text-white" />
                              </div>
                              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{item.year || year}</span>
                              </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {title}
                        </h3>

                        {cleanSummary && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                    {cleanSummary}
                              </p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all mt-auto">
                              <span>{language === "ar" ? "اقرأ المزيد" : "Read more"}</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                        </div>
                  </article>
            </Link>
      )
}
