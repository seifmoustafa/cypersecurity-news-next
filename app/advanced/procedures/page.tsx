"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { ProceduresPaginatedResponse } from "@/core/domain/models/procedure"
import { Shield, FileText, TrendingUp, Sparkles, Search } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

export default function ProceduresPage() {
      const { language, isRtl } = useLanguage()
      const [data, setData] = useState<ProceduresPaginatedResponse | null>(null)
      const [loading, setLoading] = useState(true)
      const [searchQuery, setSearchQuery] = useState("")

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        const response = await container.services.procedures.getAllProcedures(1, 100, searchQuery)
                        setData(response)
                  } catch (error) {
                        console.error("❌ Error fetching procedures:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [searchQuery])

      const procedures = data?.data || []

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[{ label: language === "ar" ? "الإجراءات" : "Procedures" }]} />
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
                        {/* Breadcrumbs: Home > Procedures */}
                        <AdvancedBreadcrumbs items={[{ label: language === "ar" ? "الإجراءات" : "Procedures" }]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {language === "ar" ? "تأمين البنية التحتية المعلوماتية" : "Information Infrastructure Security"}
                              </h1>

                              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                                    {language === "ar"
                                          ? "إجراءات الأمن السيبراني المطبقة على جميع المستخدمين والأنظمة"
                                          : "Cybersecurity procedures applicable to all users and systems"}
                              </p>

                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                          {language === "ar" ? `${procedures.length} إجراء متاح` : `${procedures.length} procedures available`}
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
                                          placeholder={language === "ar" ? "ابحث في الإجراءات..." : "Search procedures..."}
                                          className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                              </div>
                        </div>

                        {/* Procedures Grid */}
                        {procedures.length === 0 ? (
                              <div className="text-center py-16">
                                    <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {searchQuery
                                                ? (language === "ar" ? "لا توجد نتائج للبحث" : "No search results")
                                                : (language === "ar" ? "لا توجد إجراءات متاحة" : "No procedures available")
                                          }
                                    </p>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {procedures.map((procedure) => (
                                          <ProcedureCard key={procedure.id} procedure={procedure} language={language} isRtl={isRtl} />
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      )
}

function ProcedureCard({ procedure, language, isRtl }: { procedure: any; language: string; isRtl: boolean }) {
      const name = language === "ar" ? (procedure.nameAr || procedure.nameEn) : (procedure.nameEn || procedure.nameAr)
      const description = language === "ar" ? (procedure.descriptionAr || procedure.descriptionEn) : (procedure.descriptionEn || procedure.descriptionAr)
      const cleanDescription = (description || "").replace(/<\/?[^>]+(>|$)/g, "").trim()

      return (
            <Link href={`/advanced/procedures/${procedure.id}`} className="group">
                  <article className="h-full bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 p-6">
                        {/* Icon */}
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 group-hover:scale-110 transition-transform">
                              <Shield className="h-7 w-7 text-white" />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {name}
                        </h3>

                        {cleanDescription && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                    {cleanDescription}
                              </p>
                        )}

                        {/* Browse Link */}
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                              <span>{language === "ar" ? "عرض عناصر التحكم" : "View Controls"}</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                        </div>
                  </article>
            </Link>
      )
}
