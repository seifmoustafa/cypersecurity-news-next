"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Procedure, ProcedureControl, ProcedureSafeguard, ProcedureTechnique, ProcedureImplementationStep, ProcedureImplementationStepsPaginatedResponse } from "@/core/domain/models/procedure"
import { ChevronLeft, ChevronRight, Download, FileText, CheckCircle, ArrowLeft, ArrowRight, List } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"

interface StepDetailPageProps {
      params: Promise<{
            procedureId: string
            controlId: string
            safeguardId: string
            techniqueId: string
            stepId: string
      }>
}

export default function StepDetailPage({ params }: StepDetailPageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [procedure, setProcedure] = useState<Procedure | null>(null)
      const [control, setControl] = useState<ProcedureControl | null>(null)
      const [safeguard, setSafeguard] = useState<ProcedureSafeguard | null>(null)
      const [technique, setTechnique] = useState<ProcedureTechnique | null>(null)
      const [step, setStep] = useState<ProcedureImplementationStep | null>(null)
      const [allSteps, setAllSteps] = useState<ProcedureImplementationStep[]>([])
      const [loading, setLoading] = useState(true)
      const [sidebarOpen, setSidebarOpen] = useState(true)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch all data in parallel
                        const [procedureData, controlData, safeguardData, techniqueData, stepData, stepsData] = await Promise.all([
                              container.services.procedures.getProcedureById(resolvedParams.procedureId),
                              container.services.procedures.getControlById(resolvedParams.controlId),
                              container.services.procedures.getSafeguardById(resolvedParams.safeguardId),
                              container.services.procedures.getTechniqueById(resolvedParams.techniqueId),
                              container.services.procedures.getImplementationStepById(resolvedParams.stepId),
                              container.services.procedures.getImplementationStepsByTechniqueId(resolvedParams.techniqueId, 1, 100)
                        ])

                        setProcedure(procedureData)
                        setControl(controlData)
                        setSafeguard(safeguardData)
                        setTechnique(techniqueData)
                        setStep(stepData)
                        setAllSteps(stepsData.data.sort((a: ProcedureImplementationStep, b: ProcedureImplementationStep) => (a.orderNum ?? 0) - (b.orderNum ?? 0)))
                  } catch (error) {
                        console.error("❌ Error fetching step:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams])

      // Navigation helpers
      const currentStepIndex = allSteps.findIndex(s => s.id === resolvedParams.stepId)
      const prevStep = currentStepIndex > 0 ? allSteps[currentStepIndex - 1] : null
      const nextStep = currentStepIndex < allSteps.length - 1 ? allSteps[currentStepIndex + 1] : null
      const baseUrl = `/advanced/procedures/${resolvedParams.procedureId}/${resolvedParams.controlId}/${resolvedParams.safeguardId}/${resolvedParams.techniqueId}`

      const techniqueName = technique ? (language === "ar" ? (technique.nameAr || technique.nameEn) : (technique.nameEn || technique.nameAr)) : ""
      const procedureName = procedure ? (language === "ar" ? (procedure.nameAr || procedure.nameEn) : (procedure.nameEn || procedure.nameAr)) : ""
      const controlName = control ? (language === "ar" ? (control.nameAr || control.nameEn) : (control.nameEn || control.nameAr)) : ""
      const safeguardName = safeguard ? (language === "ar" ? (safeguard.nameAr || safeguard.nameEn) : (safeguard.nameEn || safeguard.nameAr)) : ""
      const stepName = step ? (language === "ar" ? (step.nameAr || step.nameEn) : (step.nameEn || step.nameAr)) : ""
      const stepDescription = step ? (language === "ar" ? (step.descriptionAr || step.descriptionEn) : (step.descriptionEn || step.descriptionAr)) : ""

      // Calculate step number - use orderNum if available, otherwise use index + 1
      const stepNumber = step?.orderNum ?? (currentStepIndex >= 0 ? currentStepIndex + 1 : 1)

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

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "الإجراءات" : "Procedures", href: "/advanced/procedures" },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                              </div>
                        </div>
                  </div>
            )
      }

      if (!step) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16 text-center py-20">
                              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {language === "ar" ? "الخطوة غير موجودة" : "Step not found"}
                              </h1>
                              <Link href={baseUrl}>
                                    <Button>{language === "ar" ? "العودة للتقنية" : "Back to Technique"}</Button>
                              </Link>
                        </div>
                  </div>
            )
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
                              { label: techniqueName || "", href: baseUrl },
                              { label: stepName || `${language === "ar" ? "خطوة" : "Step"} ${stepNumber}` }
                        ]} />

                        {/* Main Layout */}
                        <div className="flex gap-6 mt-6">
                              {/* Steps Sidebar */}
                              <aside className={`${sidebarOpen ? "w-80" : "w-12"} transition-all duration-300 flex-shrink-0`}>
                                    <div className="sticky top-24 bg-white/10 dark:bg-slate-800/50 rounded-2xl border border-white/20 dark:border-gray-700 overflow-hidden">
                                          {/* Sidebar Header */}
                                          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                                {sidebarOpen && (
                                                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                            <List className="h-4 w-4" />
                                                            {language === "ar" ? "جميع الخطوات" : "All Steps"}
                                                      </h3>
                                                )}
                                                <button
                                                      onClick={() => setSidebarOpen(!sidebarOpen)}
                                                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                      {sidebarOpen
                                                            ? (isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />)
                                                            : (isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)
                                                      }
                                                </button>
                                          </div>

                                          {/* Steps List */}
                                          {sidebarOpen && (
                                                <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
                                                      {allSteps.map((s) => {
                                                            const sName = language === "ar" ? (s.nameAr || s.nameEn) : (s.nameEn || s.nameAr)
                                                            const isActive = s.id === resolvedParams.stepId

                                                            return (
                                                                  <Link
                                                                        key={s.id}
                                                                        href={`${baseUrl}/${s.id}`}
                                                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
                                                                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                                                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                              }`}
                                                                  >
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${isActive
                                                                              ? "bg-white/20"
                                                                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                                              }`}>
                                                                              {s.orderNum ?? (allSteps.indexOf(s) + 1)}
                                                                        </div>
                                                                        <span className={`text-sm font-medium line-clamp-2 ${isActive ? "" : "text-gray-700 dark:text-gray-300"}`}>
                                                                              {sName}
                                                                        </span>
                                                                  </Link>
                                                            )
                                                      })}
                                                </div>
                                          )}
                                    </div>
                              </aside>

                              {/* Main Content */}
                              <main className="flex-1 min-w-0">
                                    {/* Step Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-6">
                                          <div className="flex items-center gap-4 mb-4">
                                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                      <span className="text-2xl font-bold text-white">{stepNumber}</span>
                                                </div>
                                                <div>
                                                      <p className="text-blue-100 text-sm mb-1">
                                                            {language === "ar" ? `خطوة ${stepNumber} من ${allSteps.length}` : `Step ${stepNumber} of ${allSteps.length}`}
                                                      </p>
                                                      <h1 className="text-2xl md:text-3xl font-bold text-white">
                                                            {stepName}
                                                      </h1>
                                                </div>
                                          </div>

                                          {/* Prev/Next Navigation */}
                                          <div className="flex items-center justify-between">
                                                {prevStep ? (
                                                      <Link href={`${baseUrl}/${prevStep.id}`}>
                                                            <Button variant="secondary" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0">
                                                                  {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                                                                  {language === "ar" ? "السابق" : "Previous"}
                                                            </Button>
                                                      </Link>
                                                ) : <div />}

                                                {nextStep ? (
                                                      <Link href={`${baseUrl}/${nextStep.id}`}>
                                                            <Button variant="secondary" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0">
                                                                  {language === "ar" ? "التالي" : "Next"}
                                                                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                                                            </Button>
                                                      </Link>
                                                ) : <div />}
                                          </div>
                                    </div>

                                    {/* Step Content */}
                                    <div className="bg-white/10 dark:bg-slate-800/50 rounded-2xl border border-white/20 dark:border-gray-700 overflow-hidden">
                                          {/* Image */}
                                          {step.imageUrl && (
                                                <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800">
                                                      <Image
                                                            src={step.imageUrl}
                                                            alt={stepName || "Step image"}
                                                            fill
                                                            className="object-contain"
                                                            priority
                                                      />
                                                </div>
                                          )}

                                          {/* Description */}
                                          <div className="p-6 md:p-8">
                                                {stepDescription && (
                                                      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                                                            <div
                                                                  className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                                                                  dangerouslySetInnerHTML={{ __html: stepDescription }}
                                                            />
                                                      </div>
                                                )}

                                                {/* Document Download */}
                                                {step.documentUrl && (
                                                      <div className="flex items-center gap-4 p-5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                  <FileText className="h-6 w-6 text-white" />
                                                            </div>
                                                            <div className="flex-1">
                                                                  <p className="font-bold text-gray-900 dark:text-white">
                                                                        {language === "ar" ? "مستند الخطوة" : "Step Document"}
                                                                  </p>
                                                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {language === "ar" ? "تحميل الملف بصيغة PDF" : "Download as PDF"}
                                                                  </p>
                                                            </div>
                                                            <Button
                                                                  onClick={() => handleDownload(step.documentUrl!, stepName || "document")}
                                                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                                                            >
                                                                  <Download className="h-4 w-4" />
                                                                  {language === "ar" ? "تحميل" : "Download"}
                                                            </Button>
                                                      </div>
                                                )}
                                          </div>
                                    </div>

                                    {/* Bottom Navigation */}
                                    <div className="flex items-center justify-between mt-6 p-4 bg-white/10 dark:bg-slate-800/50 rounded-2xl border border-white/20 dark:border-gray-700">
                                          {prevStep ? (
                                                <Link href={`${baseUrl}/${prevStep.id}`} className="group flex items-center gap-3 flex-1">
                                                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                                            {isRtl ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
                                                      </div>
                                                      <div className={isRtl ? "text-right" : "text-left"}>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                  {language === "ar" ? "الخطوة السابقة" : "Previous Step"}
                                                            </p>
                                                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                                  {language === "ar" ? (prevStep.nameAr || prevStep.nameEn) : (prevStep.nameEn || prevStep.nameAr)}
                                                            </p>
                                                      </div>
                                                </Link>
                                          ) : <div className="flex-1" />}

                                          <Link href={baseUrl}>
                                                <Button variant="outline" className="mx-4">
                                                      {language === "ar" ? "عرض الكل" : "View All"}
                                                </Button>
                                          </Link>

                                          {nextStep ? (
                                                <Link href={`${baseUrl}/${nextStep.id}`} className="group flex items-center gap-3 flex-1 justify-end">
                                                      <div className={isRtl ? "text-left" : "text-right"}>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                  {language === "ar" ? "الخطوة التالية" : "Next Step"}
                                                            </p>
                                                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                                  {language === "ar" ? (nextStep.nameAr || nextStep.nameEn) : (nextStep.nameEn || nextStep.nameAr)}
                                                            </p>
                                                      </div>
                                                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                                            {isRtl ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                                                      </div>
                                                </Link>
                                          ) : <div className="flex-1" />}
                                    </div>
                              </main>
                        </div>
                  </div>
            </div>
      )
}
