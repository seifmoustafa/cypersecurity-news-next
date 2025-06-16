"use client"

import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Settings } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Control, Standard, Safeguard, Technique, ImplementationStep } from "@/core/domain/models/standard"

export default function ImplementationStepPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ImplementationStepPageContent />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    </MainLayout>
  )
}

function ImplementationStepPageContent() {
  const params = useParams()
  const category = params.category as string
  const standardSlug = params.standard as string
  const controlSlug = params.control as string
  const safeguardSlug = params.safeguard as string
  const techniqueSlug = params.technique as string
  const implementationId = params.implementation as string
  const { language, isRtl } = useLanguage()
  const [implementationStep, setImplementationStep] = useState<ImplementationStep | null>(null)
  const [technique, setTechnique] = useState<Technique | null>(null)
  const [safeguard, setSafeguard] = useState<Safeguard | null>(null)
  const [control, setControl] = useState<Control | null>(null)
  const [standard, setStandard] = useState<Standard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const standardsService = container.standardsService

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("🔄 Starting data fetch for implementation step page...")

        // First get the implementation step by ID
        const foundImplementationStep = await standardsService.getImplementationStepById(implementationId)
        if (!foundImplementationStep) {
          console.error("❌ Implementation step not found:", implementationId)
          notFound()
        }

        console.log("✅ Found implementation step:", foundImplementationStep.nameEn)
        setImplementationStep(foundImplementationStep)

        // Then get the technique
        const foundTechnique = await standardsService.getTechniqueById(foundImplementationStep.techniqueId)
        if (!foundTechnique) {
          console.error("❌ Technique not found:", foundImplementationStep.techniqueId)
          notFound()
        }

        console.log("✅ Found technique:", foundTechnique.nameEn)
        setTechnique(foundTechnique)

        // Then get the safeguard
        const foundSafeguard = await standardsService.getSafeguardById(foundTechnique.safeguardId)
        if (!foundSafeguard) {
          console.error("❌ Safeguard not found:", foundTechnique.safeguardId)
          notFound()
        }

        console.log("✅ Found safeguard:", foundSafeguard.nameEn)
        setSafeguard(foundSafeguard)

        // Then get the control
        const foundControl = await standardsService.getControlById(foundSafeguard.controlId)
        if (!foundControl) {
          console.error("❌ Control not found:", foundSafeguard.controlId)
          notFound()
        }

        console.log("✅ Found control:", foundControl.nameEn)
        setControl(foundControl)

        // Finally get the standard
        const foundStandard = await standardsService.getStandardById(foundControl.standardId)
        if (!foundStandard) {
          console.error("❌ Standard not found:", foundControl.standardId)
          notFound()
        }

        console.log("✅ Found standard:", foundStandard.nameEn)
        setStandard(foundStandard)
      } catch (error) {
        console.error("❌ Error fetching data:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (implementationId) {
      fetchData()
    }
  }, [implementationId, standardsService])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!implementationStep || !technique || !safeguard || !control || !standard) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/standards/${category}/${standardSlug}/${controlSlug}/${safeguardSlug}/${techniqueSlug}`}>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى التقنية" : "Back to Technique"}</span>
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 dark:from-green-400/10 dark:to-green-500/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-mono font-semibold">
                    {language === "ar" ? "خطوة" : "Step"} {implementationStep.orderNum}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-green-900 dark:text-green-100">
                {language === "ar"
                  ? implementationStep.nameAr || implementationStep.nameEn
                  : implementationStep.nameEn || implementationStep.nameAr}
              </h1>
              <p className="text-green-700 dark:text-green-300 text-lg">
                {language === "ar"
                  ? implementationStep.descriptionAr || implementationStep.descriptionEn
                  : implementationStep.descriptionEn || implementationStep.descriptionAr}
              </p>
            </div>
          </div>

          {/* Implementation Step Details */}
          <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
                {language === "ar" ? "تفاصيل خطوة التنفيذ" : "Implementation Step Details"}
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-foreground">
                {language === "ar"
                  ? implementationStep.descriptionAr || implementationStep.descriptionEn
                  : implementationStep.descriptionEn || implementationStep.descriptionAr}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {language === "ar" ? "رقم الخطوة" : "Step Number"}
                  </h3>
                  <p className="font-mono bg-background px-3 py-2 rounded border border-border text-green-800 dark:text-green-200 font-semibold">
                    {implementationStep.orderNum}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    {language === "ar" ? "التقنية المرتبطة" : "Related Technique"}
                  </h3>
                  <p className="font-mono bg-background px-3 py-2 rounded border border-border text-purple-800 dark:text-purple-200 font-semibold">
                    {technique.code || "N/A"} -{" "}
                    {language === "ar" ? technique.nameAr || technique.nameEn : technique.nameEn || technique.nameAr}
                  </p>
                </div>
              </div>

              {/* Hierarchy Path */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-3">
                  {language === "ar" ? "المسار الهرمي" : "Hierarchy Path"}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {language === "ar" ? standard.nameAr || standard.nameEn : standard.nameEn || standard.nameAr}
                  </span>
                  <ChevronLeft className={`h-4 w-4 text-muted-foreground ${isRtl ? "rotate-180" : ""}`} />
                  <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                    {control.code} -{" "}
                    {language === "ar" ? control.nameAr || control.nameEn : control.nameEn || control.nameAr}
                  </span>
                  <ChevronLeft className={`h-4 w-4 text-muted-foreground ${isRtl ? "rotate-180" : ""}`} />
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {safeguard.code} -{" "}
                    {language === "ar" ? safeguard.nameAr || safeguard.nameEn : safeguard.nameEn || safeguard.nameAr}
                  </span>
                  <ChevronLeft className={`h-4 w-4 text-muted-foreground ${isRtl ? "rotate-180" : ""}`} />
                  <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    {technique.code} -{" "}
                    {language === "ar" ? technique.nameAr || technique.nameEn : technique.nameEn || technique.nameAr}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "ar" ? "معلومات إضافية" : "Additional Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{language === "ar" ? "تاريخ الإنشاء:" : "Created:"}</span>
                    <span className="ml-2">
                      {implementationStep.createdAt !== "0001-01-01T00:00:00"
                        ? new Date(implementationStep.createdAt).toLocaleDateString()
                        : language === "ar"
                          ? "غير محدد"
                          : "Not specified"}
                    </span>
                  </div>
                  {implementationStep.updatedAt && (
                    <div>
                      <span className="font-medium">{language === "ar" ? "آخر تحديث:" : "Updated:"}</span>
                      <span className="ml-2">{new Date(implementationStep.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">{language === "ar" ? "الحالة:" : "Status:"}</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        implementationStep.isActive
                          ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {implementationStep.isActive
                        ? language === "ar"
                          ? "نشط"
                          : "Active"
                        : language === "ar"
                          ? "غير نشط"
                          : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
