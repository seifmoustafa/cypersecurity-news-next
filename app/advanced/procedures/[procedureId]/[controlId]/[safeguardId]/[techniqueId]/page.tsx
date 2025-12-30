"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Procedure, ProcedureControl, ProcedureSafeguard, ProcedureTechnique, ProcedureImplementationStepsPaginatedResponse } from "@/core/domain/models/procedure"
import { Target, CheckCircle, Download, FileText, Sparkles, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"

interface TechniquePageProps {
      params: Promise<{
            procedureId: string
            controlId: string
            safeguardId: string
            techniqueId: string
      }>
}

export default function TechniqueDetailPage({ params }: TechniquePageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [procedure, setProcedure] = useState<Procedure | null>(null)
      const [control, setControl] = useState<ProcedureControl | null>(null)
      const [safeguard, setSafeguard] = useState<ProcedureSafeguard | null>(null)
      const [technique, setTechnique] = useState<ProcedureTechnique | null>(null)
      const [stepsData, setStepsData] = useState<ProcedureImplementationStepsPaginatedResponse | null>(null)
      const [loading, setLoading] = useState(true)
      const [currentPage, setCurrentPage] = useState(1)
      const pageSize = 9

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch all data in parallel
                        const [procedureData, controlData, safeguardData, techniqueData, steps] = await Promise.all([
                              container.services.procedures.getProcedureById(resolvedParams.procedureId),
                              container.services.procedures.getControlById(resolvedParams.controlId),
                              container.services.procedures.getSafeguardById(resolvedParams.safeguardId),
                              container.services.procedures.getTechniqueById(resolvedParams.techniqueId),
                              container.services.procedures.getImplementationStepsByTechniqueId(resolvedParams.techniqueId, currentPage, pageSize)
                        ])

                        setProcedure(procedureData)
                        setControl(controlData)
                        setSafeguard(safeguardData)
                        setTechnique(techniqueData)
                        setStepsData(steps)
                  } catch (error) {
                        console.error("❌ Error fetching technique:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.procedureId, resolvedParams.controlId, resolvedParams.safeguardId, resolvedParams.techniqueId, currentPage])

      const procedureName = procedure ? (language === "ar" ? (procedure.nameAr || procedure.nameEn) : (procedure.nameEn || procedure.nameAr)) : ""
      const controlName = control ? (language === "ar" ? (control.nameAr || control.nameEn) : (control.nameEn || control.nameAr)) : ""
      const safeguardName = safeguard ? (language === "ar" ? (safeguard.nameAr || safeguard.nameEn) : (safeguard.nameEn || safeguard.nameAr)) : ""
      const techniqueName = technique ? (language === "ar" ? (technique.nameAr || technique.nameEn) : (technique.nameEn || technique.nameAr)) : ""
      const techniqueDescription = technique ? (language === "ar" ? (technique.descriptionAr || technique.descriptionEn) : (technique.descriptionEn || technique.descriptionAr)) : ""
      const steps = stepsData?.data?.sort((a, b) => a.orderNum - b.orderNum) || []
      const totalPages = stepsData?.pagination?.pagesCount || 1
      const totalItems = stepsData?.pagination?.itemsCount || 0

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "الإجراءات" : "Procedures", href: "/advanced/procedures" },
                                    { label: "..." }, { label: "..." }, { label: "..." }, { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                          {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      const handleDownload = (documentUrl: string, name: string) => {
            if (documentUrl) {
                  const link = document.createElement("a")
                  link.href = documentUrl
                  link.download = `${name}.pdf`
                  link.target = "_blank"
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
            }
      }

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "الإجراءات" : "Procedures", href: "/advanced/procedures" },
                              { label: procedureName || "", href: `/advanced/procedures/${resolvedParams.procedureId}` },
                              { label: controlName || "", href: `/advanced/procedures/${resolvedParams.procedureId}/${resolvedParams.controlId}` },
                              { label: safeguardName || "", href: `/advanced/procedures/${resolvedParams.procedureId}/${resolvedParams.controlId}/${resolvedParams.safeguardId}` },
                              { label: techniqueName || "" }
                        ]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              {technique?.code && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                                          <span className="text-sm font-mono font-medium text-purple-700 dark:text-purple-300">{technique.code}</span>
                                    </div>
                              )}

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {techniqueName}
                              </h1>

                              {techniqueDescription && (
                                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl whitespace-pre-line">
                                          {techniqueDescription.replace(/<\/?[^>]+(>|$)/g, "").trim()}
                                    </p>
                              )}

                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    {/* <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" /> */}
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                          {language === "ar" ? `${totalItems} خطوة تنفيذ` : `${totalItems} implementation steps`}
                                    </span>
                              </div>
                        </div>

                        {/* Implementation Steps Header */}
                        <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
                              </h2>

                              {totalPages > 1 && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                          {language === "ar"
                                                ? `صفحة ${currentPage} من ${totalPages}`
                                                : `Page ${currentPage} of ${totalPages}`}
                                    </div>
                              )}
                        </div>

                        {/* Steps Grid - Compact Cards */}
                        {steps.length === 0 ? (
                              <div className="text-center py-16">
                                    <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {language === "ar" ? "لا توجد خطوات تنفيذ متاحة" : "No implementation steps available"}
                                    </p>
                              </div>
                        ) : (
                              <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                          {steps.map((step, index) => {
                                                const stepName = language === "ar" ? (step.nameAr || step.nameEn) : (step.nameEn || step.nameAr)
                                                const stepDesc = language === "ar" ? (step.descriptionAr || step.descriptionEn) : (step.descriptionEn || step.descriptionAr)
                                                const cleanDesc = (stepDesc || "").replace(/<\/?[^>]+(>|$)/g, "").trim()
                                                const stepNumber = step.orderNum ?? (index + 1)

                                                return (
                                                      <Link
                                                            key={step.id}
                                                            href={`/advanced/procedures/${resolvedParams.procedureId}/${resolvedParams.controlId}/${resolvedParams.safeguardId}/${resolvedParams.techniqueId}/${step.id}`}
                                                            className="group"
                                                      >
                                                            <article className="h-full min-h-[340px] bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
                                                                  {/* Thumbnail */}
                                                                  <div className="relative h-52 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 overflow-hidden">
                                                                        {step.imageUrl ? (
                                                                              <Image
                                                                                    src={step.imageUrl}
                                                                                    alt={stepName || "Step"}
                                                                                    fill
                                                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                              />
                                                                        ) : (
                                                                              <div className="w-full h-full flex items-center justify-center">
                                                                                    <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                                                                              </div>
                                                                        )}

                                                                        {/* Step Number Badge */}
                                                                        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                                              <span className="text-lg font-bold text-white">{stepNumber}</span>
                                                                        </div>
                                                                  </div>

                                                                  {/* Content */}
                                                                  <div className="p-5">
                                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                                                              {stepName}
                                                                        </h3>

                                                                        {/* Description Snippet */}
                                                                        {cleanDesc && (
                                                                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                                                    {cleanDesc}
                                                                              </p>
                                                                        )}

                                                                        {/* Actions Row */}
                                                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                                                                              {step.documentUrl ? (
                                                                                    <button
                                                                                          onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                e.stopPropagation()
                                                                                                handleDownload(step.documentUrl!, stepName || "document")
                                                                                          }}
                                                                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                                                                    >
                                                                                          <Download className="h-3.5 w-3.5" />
                                                                                          PDF
                                                                                    </button>
                                                                              ) : (
                                                                                    <div></div>
                                                                              )}

                                                                              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
                                                                                    <span>{language === "ar" ? "عرض" : "View"}</span>
                                                                                    <ChevronLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </article>
                                                      </Link>
                                                )
                                          })}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                          <div className="flex items-center justify-center gap-4">
                                                <Button
                                                      variant="outline"
                                                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                      disabled={currentPage === 1}
                                                      className="gap-2"
                                                >
                                                      {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                                      {language === "ar" ? "السابق" : "Previous"}
                                                </Button>

                                                <div className="flex items-center gap-2">
                                                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                            <button
                                                                  key={page}
                                                                  onClick={() => setCurrentPage(page)}
                                                                  className={`w-10 h-10 rounded-lg font-medium transition-all ${page === currentPage
                                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                                        : "bg-white/10 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                                                        }`}
                                                            >
                                                                  {page}
                                                            </button>
                                                      ))}
                                                </div>

                                                <Button
                                                      variant="outline"
                                                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                      disabled={currentPage === totalPages}
                                                      className="gap-2"
                                                >
                                                      {language === "ar" ? "التالي" : "Next"}
                                                      {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                </Button>
                                          </div>
                                    )}
                              </>
                        )}
                  </div>
            </div>
      )
}
