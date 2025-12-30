"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { InstructionCategory } from "@/core/domain/models/instruction-category"
import type { InstructionYearsResponse } from "@/core/domain/models/instruction-year"
import { FileText, Calendar, TrendingUp, Sparkles, Folder } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

interface CategoryYearsPageProps {
      params: Promise<{
            categoryId: string
      }>
}

export default function InstructionCategoryYearsPage({ params }: CategoryYearsPageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [category, setCategory] = useState<InstructionCategory | null>(null)
      const [yearsData, setYearsData] = useState<InstructionYearsResponse | null>(null)
      const [loading, setLoading] = useState(true)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch category
                        const categoryData = await container.services.instructionCategories.getCategoryById(resolvedParams.categoryId)
                        setCategory(categoryData)

                        // Fetch years for this category
                        const years = await container.services.instructionYears.getYearsByCategory(resolvedParams.categoryId, 1, 100)
                        setYearsData(years)
                  } catch (error) {
                        console.error("❌ Error fetching category years:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.categoryId])

      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""
      const years = yearsData?.data || []

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category" },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                          {[...Array(8)].map((_, i) => (
                                                <div key={i} className="h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
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
                        {/* Breadcrumbs: Home > Instructions > [Category] */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category" },
                              { label: categoryName }
                        ]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              {/* <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
                                    <Folder className="h-8 w-8 text-white" />
                              </div> */}

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {categoryName}
                              </h1>

                              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                                    {language === "ar"
                                          ? `اختر السنة لعرض تعليمات ${categoryName}`
                                          : `Select a year to view ${categoryName} instructions`}
                              </p>

                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                          {language === "ar" ? `${years.length} سنة متاحة` : `${years.length} years available`}
                                    </span>
                              </div>
                        </div>

                        {/* Years Grid */}
                        {years.length === 0 ? (
                              <div className="text-center py-16">
                                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {language === "ar" ? "لا توجد سنوات متاحة" : "No years available"}
                                    </p>
                              </div>
                        ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {years.map((yearItem) => (
                                          <YearCard key={yearItem.id} yearItem={yearItem} categoryId={resolvedParams.categoryId} language={language} isRtl={isRtl} />
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      )
}

function YearCard({ yearItem, categoryId, language, isRtl }: { yearItem: any; categoryId: string; language: string; isRtl: boolean }) {
      return (
            <Link href={`/advanced/instructions/category/${categoryId}/year/${yearItem.id}`} className="group">
                  <article className="h-full bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 p-6 text-center">
                        {/* Year Number */}
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
                              <span className="text-2xl font-bold text-white">{yearItem.year}</span>
                        </div>

                        {/* Year Label */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {language === "ar" ? `تعليمات ${yearItem.year}` : `${yearItem.year} Instructions`}
                        </h3>

                        {/* View Link */}
                        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all mt-3">
                              <span>{language === "ar" ? "عرض" : "View"}</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                        </div>
                  </article>
            </Link>
      )
}
