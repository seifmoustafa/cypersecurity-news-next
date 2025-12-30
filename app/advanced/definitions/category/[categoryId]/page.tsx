"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Definition, DefinitionCategory, DefinitionsPaginatedResponse } from "@/core/domain/models/definition"
import { BookOpen, Sparkles, Search, ChevronLeft } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

export default function DefinitionCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
      const resolvedParams = use(params)
      const { language, isRtl } = useLanguage()
      const [category, setCategory] = useState<DefinitionCategory | null>(null)
      const [data, setData] = useState<DefinitionsPaginatedResponse | null>(null)
      const [loading, setLoading] = useState(true)
      const [searchQuery, setSearchQuery] = useState("")
      const [currentPage, setCurrentPage] = useState(1)
      const pageSize = 12

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        // Fetch category details
                        const cat = await container.services.definitions.getCategoryById(resolvedParams.categoryId)
                        setCategory(cat)

                        // Fetch definitions for this category (professionals endpoint)
                        const response = await container.services.definitions.getDefinitionsByCategoryForProfessionals(
                              resolvedParams.categoryId,
                              currentPage,
                              pageSize,
                              searchQuery || undefined
                        )
                        setData(response)
                  } catch (error) {
                        console.error("❌ Error fetching definitions:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.categoryId, currentPage, searchQuery])

      const definitions = data?.data || []
      const pagination = data?.pagination
      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""

      if (loading && !category) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "التعريفات" : "Definitions", href: "/advanced/definitions" },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
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
                        {/* Breadcrumbs: Home > Definitions > Category Name */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "التعريفات" : "Definitions", href: "/advanced/definitions" },
                              { label: categoryName }
                        ]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
                                    <BookOpen className="h-8 w-8 text-white" />
                              </div>

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {categoryName}
                              </h1>

                              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                                    {language === "ar"
                                          ? "تصفح التعريفات والمفاهيم في هذه الفئة"
                                          : "Browse definitions and concepts in this category"}
                              </p>

                              {pagination && (
                                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                {language === "ar" ? `${pagination.itemsCount} تعريف` : `${pagination.itemsCount} definitions`}
                                          </span>
                                    </div>
                              )}
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                              <div className="relative max-w-md">
                                    <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                          type="text"
                                          value={searchQuery}
                                          onChange={(e) => {
                                                setSearchQuery(e.target.value)
                                                setCurrentPage(1)
                                          }}
                                          placeholder={language === "ar" ? "ابحث في التعريفات..." : "Search definitions..."}
                                          className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                              </div>
                        </div>

                        {/* Definitions Grid */}
                        {loading ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[...Array(6)].map((_, i) => (
                                          <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                                    ))}
                              </div>
                        ) : definitions.length === 0 ? (
                              <div className="text-center py-16">
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {searchQuery
                                                ? (language === "ar" ? "لا توجد نتائج للبحث" : "No search results")
                                                : (language === "ar" ? "لا توجد تعريفات متاحة" : "No definitions available")
                                          }
                                    </p>
                              </div>
                        ) : (
                              <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {definitions.map((definition) => (
                                                <DefinitionCard key={definition.id} definition={definition} language={language} isRtl={isRtl} />
                                          ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.pagesCount > 1 && (
                                          <div className="flex items-center justify-center gap-4 mt-8">
                                                <button
                                                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                      disabled={currentPage === 1}
                                                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                      <ChevronLeft className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                                      {language === "ar" ? "السابق" : "Previous"}
                                                </button>
                                                <span className="text-gray-600 dark:text-gray-400">
                                                      {language === "ar"
                                                            ? `صفحة ${currentPage} من ${pagination.pagesCount}`
                                                            : `Page ${currentPage} of ${pagination.pagesCount}`}
                                                </span>
                                                <button
                                                      onClick={() => setCurrentPage(prev => Math.min(pagination.pagesCount, prev + 1))}
                                                      disabled={currentPage === pagination.pagesCount}
                                                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                      {language === "ar" ? "التالي" : "Next"}
                                                      <ChevronLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
                                                </button>
                                          </div>
                                    )}
                              </>
                        )}
                  </div>
            </div>
      )
}

function DefinitionCard({ definition, language, isRtl }: { definition: Definition; language: string; isRtl: boolean }) {
      const term = language === "ar" ? (definition.term || definition.termEn) : (definition.termEn || definition.term)
      const text = language === "ar" ? (definition.definitionText || definition.definitionEn) : (definition.definitionEn || definition.definitionText)
      const cleanText = (text || "").replace(/<\/?[^>]+(>|$)/g, "").trim()

      return (
            <Link href={`/advanced/definitions/${definition.id}`} className="group">
                  <article className="h-full min-h-[200px] bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 p-6 flex flex-col">
                        {/* Term */}
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {term}
                        </h3>

                        {/* Definition text snippet */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-grow">
                              {cleanText}
                        </p>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                              <span>{language === "ar" ? "اقرأ المزيد" : "Read More"}</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                        </div>
                  </article>
            </Link>
      )
}
