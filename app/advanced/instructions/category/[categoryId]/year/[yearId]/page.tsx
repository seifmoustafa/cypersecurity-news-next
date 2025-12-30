"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { InstructionCategory } from "@/core/domain/models/instruction-category"
import type { InstructionYear } from "@/core/domain/models/instruction-year"
import type { InstructionsPaginatedResponse } from "@/core/domain/models/instruction"
import { FileText, Calendar, TrendingUp, Sparkles, Search, Download } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

interface YearInstructionsPageProps {
      params: Promise<{
            categoryId: string
            yearId: string
      }>
}

export default function InstructionYearPage({ params }: YearInstructionsPageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [category, setCategory] = useState<InstructionCategory | null>(null)
      const [yearData, setYearData] = useState<InstructionYear | null>(null)
      const [instructionsData, setInstructionsData] = useState<InstructionsPaginatedResponse | null>(null)
      const [loading, setLoading] = useState(true)
      const [searchQuery, setSearchQuery] = useState("")

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch category
                        const categoryData = await container.services.instructionCategories.getCategoryById(resolvedParams.categoryId)
                        setCategory(categoryData)

                        // Fetch year data
                        const year = await container.services.instructionYears.getYearById(resolvedParams.yearId)
                        setYearData(year)

                        // Fetch instructions for this year
                        const instructions = await container.services.instructions.getInstructionsByYearId(resolvedParams.yearId, 1, 100)
                        setInstructionsData(instructions)
                  } catch (error) {
                        console.error("❌ Error fetching year instructions:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.categoryId, resolvedParams.yearId])

      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""
      const instructions = instructionsData?.data || []

      const filteredInstructions = instructions.filter(item => {
            const title = language === "ar" ? item.title : (item.titleEn || item.title)
            return title?.toLowerCase().includes(searchQuery.toLowerCase())
      })

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category" },
                                    { label: "..." },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
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
                        {/* Breadcrumbs: Home > Instructions > [Category] > [Year] */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category" },
                              { label: categoryName, href: `/advanced/instructions/category/${resolvedParams.categoryId}` },
                              { label: yearData?.year?.toString() || "" }
                        ]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              {/* <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
                                    <Calendar className="h-8 w-8 text-white" />
                              </div> */}

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {language === "ar"
                                          ? `تعليمات ${categoryName} - ${yearData?.year}`
                                          : `${categoryName} Instructions - ${yearData?.year}`}
                              </h1>

                              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                                    {language === "ar"
                                          ? `تصفح جميع تعليمات ${categoryName} لعام ${yearData?.year}`
                                          : `Browse all ${categoryName} instructions for ${yearData?.year}`}
                              </p>

                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                          {language === "ar" ? `${filteredInstructions.length} تعليمة متاحة` : `${filteredInstructions.length} instructions available`}
                                    </span>
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
                                          placeholder={language === "ar" ? "ابحث في التعليمات..." : "Search instructions..."}
                                          className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                              </div>
                        </div>

                        {/* Instructions Grid */}
                        {filteredInstructions.length === 0 ? (
                              <div className="text-center py-16">
                                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {searchQuery
                                                ? (language === "ar" ? "لا توجد نتائج للبحث" : "No search results")
                                                : (language === "ar" ? "لا توجد تعليمات متاحة لهذا العام" : "No instructions available for this year")
                                          }
                                    </p>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredInstructions.map((item) => (
                                          <InstructionCard
                                                key={item.id}
                                                item={item}
                                                categoryId={resolvedParams.categoryId}
                                                yearId={resolvedParams.yearId}
                                                language={language}
                                                isRtl={isRtl}
                                          />
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      )
}

function InstructionCard({ item, categoryId, yearId, language, isRtl }: { item: any; categoryId: string; yearId: string; language: string; isRtl: boolean }) {
      const title = language === "ar" ? item.title : (item.titleEn || item.title)
      const summary = language === "ar" ? item.summary : (item.summaryEn || item.summary)
      const cleanSummary = (summary || "").replace(/<\/?[^>]+(>|$)/g, "").trim()

      return (
            <Link href={`/advanced/instructions/category/${categoryId}/year/${yearId}/${item.id}`} className="group">
                  <article className="h-full bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 p-6">
                        {/* Icon & Badge */}
                        <div className="flex items-start justify-between mb-6">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <FileText className="h-6 w-6 text-white" />
                              </div>

                              {item.documentUrl && (
                                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center gap-1">
                                          <Download className="h-3 w-3 text-green-600 dark:text-green-400" />
                                          <span className="text-xs font-medium text-green-600 dark:text-green-400">PDF</span>
                                    </div>
                              )}
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
                              <span>{language === "ar" ? "عرض التفاصيل" : "View Details"}</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                        </div>
                  </article>
            </Link>
      )
}
