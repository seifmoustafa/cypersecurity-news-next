"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Procedure, ProcedureControl, ProcedureSafeguard, ProcedureTechniquesPaginatedResponse } from "@/core/domain/models/procedure"
import { ShieldCheck, Target, Sparkles, Search } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

interface SafeguardPageProps {
      params: Promise<{
            procedureId: string
            controlId: string
            safeguardId: string
      }>
}

export default function SafeguardDetailPage({ params }: SafeguardPageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [procedure, setProcedure] = useState<Procedure | null>(null)
      const [control, setControl] = useState<ProcedureControl | null>(null)
      const [safeguard, setSafeguard] = useState<ProcedureSafeguard | null>(null)
      const [techniquesData, setTechniquesData] = useState<ProcedureTechniquesPaginatedResponse | null>(null)
      const [loading, setLoading] = useState(true)
      const [searchQuery, setSearchQuery] = useState("")

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch procedure for breadcrumbs
                        const procedureData = await container.services.procedures.getProcedureById(resolvedParams.procedureId)
                        setProcedure(procedureData)

                        // Fetch control for breadcrumbs
                        const controlData = await container.services.procedures.getControlById(resolvedParams.controlId)
                        setControl(controlData)

                        // Fetch safeguard
                        const safeguardData = await container.services.procedures.getSafeguardById(resolvedParams.safeguardId)
                        setSafeguard(safeguardData)

                        // Fetch techniques for this safeguard
                        const techniques = await container.services.procedures.getTechniquesBySafeguardId(resolvedParams.safeguardId, 1, 100, searchQuery)
                        setTechniquesData(techniques)
                  } catch (error) {
                        console.error("❌ Error fetching safeguard:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.procedureId, resolvedParams.controlId, resolvedParams.safeguardId, searchQuery])

      const procedureName = procedure ? (language === "ar" ? (procedure.nameAr || procedure.nameEn) : (procedure.nameEn || procedure.nameAr)) : ""
      const controlName = control ? (language === "ar" ? (control.nameAr || control.nameEn) : (control.nameEn || control.nameAr)) : ""
      const safeguardName = safeguard ? (language === "ar" ? (safeguard.nameAr || safeguard.nameEn) : (safeguard.nameEn || safeguard.nameAr)) : ""
      const safeguardDescription = safeguard ? (language === "ar" ? (safeguard.descriptionAr || safeguard.descriptionEn) : (safeguard.descriptionEn || safeguard.descriptionAr)) : ""
      const techniques = techniquesData?.data || []

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "الإجراءات" : "Procedures", href: "/advanced/procedures" },
                                    { label: "..." },
                                    { label: "..." },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
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
                        {/* Breadcrumbs: Home > Procedures > [Procedure] > [Control] > [Safeguard] */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "الإجراءات" : "Procedures", href: "/advanced/procedures" },
                              { label: procedureName || "", href: `/advanced/procedures/${resolvedParams.procedureId}` },
                              { label: controlName || "", href: `/advanced/procedures/${resolvedParams.procedureId}/${resolvedParams.controlId}` },
                              { label: safeguardName || "" }
                        ]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              {safeguard?.code && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                          <span className="text-sm font-mono font-medium text-green-700 dark:text-green-300">{safeguard.code}</span>
                                    </div>
                              )}

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {safeguardName}
                              </h1>

                              {safeguardDescription && (
                                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl whitespace-pre-line">
                                          {safeguardDescription.replace(/<\/?[^>]+(>|$)/g, "").trim()}
                                    </p>
                              )}

                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                          {language === "ar" ? `${techniques.length} تقنية` : `${techniques.length} techniques`}
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
                                          placeholder={language === "ar" ? "ابحث في التقنيات..." : "Search techniques..."}
                                          className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                              </div>
                        </div>

                        {/* Techniques Section */}
                        <div className="space-y-6">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {language === "ar" ? "التقنيات" : "Techniques"}
                              </h2>

                              {techniques.length === 0 ? (
                                    <div className="text-center py-16">
                                          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                          <p className="text-xl text-gray-600 dark:text-gray-400">
                                                {language === "ar" ? "لا توجد تقنيات متاحة" : "No techniques available"}
                                          </p>
                                    </div>
                              ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {techniques.map((technique) => (
                                                <TechniqueCard
                                                      key={technique.id}
                                                      technique={technique}
                                                      procedureId={resolvedParams.procedureId}
                                                      controlId={resolvedParams.controlId}
                                                      safeguardId={resolvedParams.safeguardId}
                                                      language={language}
                                                      isRtl={isRtl}
                                                />
                                          ))}
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      )
}

function TechniqueCard({ technique, procedureId, controlId, safeguardId, language, isRtl }: { technique: any; procedureId: string; controlId: string; safeguardId: string; language: string; isRtl: boolean }) {
      const name = language === "ar" ? (technique.nameAr || technique.nameEn) : (technique.nameEn || technique.nameAr)
      const description = language === "ar" ? (technique.descriptionAr || technique.descriptionEn) : (technique.descriptionEn || technique.descriptionAr)
      const cleanDescription = (description || "").replace(/<\/?[^>]+(>|$)/g, "").trim()

      return (
            <Link href={`/advanced/procedures/${procedureId}/${controlId}/${safeguardId}/${technique.id}`} className="group">
                  <article className="h-full bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 p-6">
                        {/* Icon & Code */}
                        <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Target className="h-6 w-6 text-white" />
                              </div>
                              {technique.code && (
                                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                          <span className="text-xs font-mono font-medium text-purple-600 dark:text-purple-400">{technique.code}</span>
                                    </div>
                              )}
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {name}
                        </h3>

                        {cleanDescription && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                    {cleanDescription}
                              </p>
                        )}

                        {/* View Link */}
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                              <span>{language === "ar" ? "عرض خطوات التنفيذ" : "View Implementation Steps"}</span>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                        </div>
                  </article>
            </Link>
      )
}
