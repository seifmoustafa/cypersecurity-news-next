"use client"

import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Zap } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Control, Standard, Safeguard, Technique, ImplementationStep } from "@/core/domain/models/standard"
import { slugify } from "@/lib/utils"

export default function TechniquePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TechniquePageContent />
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

function TechniquePageContent() {
  const params = useParams()
  const category = params.category as string
  const standardSlug = params.standard as string
  const controlSlug = params.control as string
  const safeguardSlug = params.safeguard as string
  const techniqueSlug = params.technique as string
  const { language, isRtl } = useLanguage()
  const [technique, setTechnique] = useState<Technique | null>(null)
  const [safeguard, setSafeguard] = useState<Safeguard | null>(null)
  const [control, setControl] = useState<Control | null>(null)
  const [standard, setStandard] = useState<Standard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [implementationSteps, setImplementationSteps] = useState<ImplementationStep[]>([])
  const [implementationStepsLoading, setImplementationStepsLoading] = useState(false)

  const standardsService = container.standardsService

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("🔄 Starting data fetch for technique page...")

        // First get the standard
        const allStandards = await standardsService.getAllStandards()
        const foundStandard = allStandards.find(
          (s) =>
            slugify(s.nameEn) === standardSlug ||
            slugify(s.nameAr) === standardSlug ||
            s.id === standardSlug,
        )

        if (!foundStandard) {
          console.error("❌ Standard not found:", standardSlug)
          notFound()
        }

        console.log("✅ Found standard:", foundStandard.nameEn)
        setStandard(foundStandard)

        // Then get controls for this standard
        const controlsResponse = await standardsService.getControlsByStandardId(foundStandard.id, 1, 100)
        const foundControl = controlsResponse.data.find(
          (c) =>
            slugify(c.nameEn) === controlSlug ||
            slugify(c.nameAr) === controlSlug ||
            c.id === controlSlug,
        )

        if (!foundControl) {
          console.error("❌ Control not found:", controlSlug)
          notFound()
        }

        console.log("✅ Found control:", foundControl.nameEn)
        setControl(foundControl)

        // Then get safeguards for this control
        const safeguardsResponse = await standardsService.getSafeguardsByControlId(foundControl.id, 1, 100)
        const foundSafeguard = safeguardsResponse.data.find(
          (s) =>
            slugify(s.nameEn) === safeguardSlug ||
            slugify(s.nameAr) === safeguardSlug ||
            s.id === safeguardSlug,
        )

        if (!foundSafeguard) {
          console.error("❌ Safeguard not found:", safeguardSlug)
          notFound()
        }

        console.log("✅ Found safeguard:", foundSafeguard.nameEn)
        setSafeguard(foundSafeguard)

        // Finally get techniques for this safeguard
        const techniquesResponse = await standardsService.getTechniquesBySafeguardId(foundSafeguard.id, 1, 100)
        const foundTechnique = techniquesResponse.data.find(
          (t) =>
            slugify(t.nameEn) === techniqueSlug ||
            slugify(t.nameAr) === techniqueSlug ||
            t.id === techniqueSlug,
        )

        if (!foundTechnique) {
          console.error("❌ Technique not found:", techniqueSlug)
          notFound()
        }

        console.log("✅ Found technique:", foundTechnique.nameEn)
        setTechnique(foundTechnique)

        // Finally get implementation steps for this technique
        setImplementationStepsLoading(true)
        try {
          const implementationStepsResponse = await standardsService.getImplementationStepsByTechniqueId(
            foundTechnique.id,
            1,
            100,
          )
          console.log(`✅ Found ${implementationStepsResponse.data.length} implementation steps`)
          setImplementationSteps(implementationStepsResponse.data.sort((a, b) => a.orderNum - b.orderNum))
        } catch (error) {
          console.error("❌ Error fetching implementation steps:", error)
          setImplementationSteps([])
        } finally {
          setImplementationStepsLoading(false)
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (standardSlug && controlSlug && safeguardSlug && techniqueSlug) {
      fetchData()
    }
  }, [standardSlug, controlSlug, safeguardSlug, techniqueSlug, standardsService])

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

  if (!technique || !safeguard || !control || !standard) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/standards/${category}/${standardSlug}/${controlSlug}/${safeguardSlug}`}>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الإجراء الوقائي" : "Back to Safeguard"}</span>
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 dark:from-purple-400/10 dark:to-purple-500/10 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-mono font-semibold">
                    {technique.code || "N/A"}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-purple-900 dark:text-purple-100">
                {language === "ar" ? technique.nameAr || technique.nameEn : technique.nameEn || technique.nameAr}
              </h1>
              <p className="text-purple-700 dark:text-purple-300 text-lg">
                {language === "ar"
                  ? technique.descriptionAr || technique.descriptionEn
                  : technique.descriptionEn || technique.descriptionAr}
              </p>
            </div>
          </div>

          {/* Technique Details */}
          <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                {language === "ar" ? "تفاصيل التقنية" : "Technique Details"}
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-foreground">
                {language === "ar"
                  ? technique.descriptionAr || technique.descriptionEn
                  : technique.descriptionEn || technique.descriptionAr}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 dark:bg-purple-950/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {language === "ar" ? "رمز التقنية" : "Technique Code"}
                  </h3>
                  <p className="font-mono bg-background px-3 py-2 rounded border border-border text-purple-800 dark:text-purple-200 font-semibold">
                    {technique.code || "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    {language === "ar" ? "الإجراء الوقائي المرتبط" : "Related Safeguard"}
                  </h3>
                  <p className="font-mono bg-background px-3 py-2 rounded border border-border text-blue-800 dark:text-blue-200 font-semibold">
                    {safeguard.code || "N/A"} -{" "}
                    {language === "ar" ? safeguard.nameAr || safeguard.nameEn : safeguard.nameEn || safeguard.nameAr}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "ar" ? "معلومات إضافية" : "Additional Information"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{language === "ar" ? "تاريخ الإنشاء:" : "Created:"}</span>
                    <span className="ml-2">{new Date(technique.createdAt).toLocaleDateString()}</span>
                  </div>
                  {technique.updatedAt && (
                    <div>
                      <span className="font-medium">{language === "ar" ? "آخر تحديث:" : "Updated:"}</span>
                      <span className="ml-2">{new Date(technique.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Steps Section */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
              </h2>
            </div>

            {implementationStepsLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse text-muted-foreground">
                  {language === "ar" ? "جاري تحميل خطوات التنفيذ..." : "Loading implementation steps..."}
                </div>
              </div>
            ) : implementationSteps.length > 0 ? (
              <div className="grid gap-4">
                {implementationSteps.map((step) => {
                  const stepSlug = slugify(step.nameEn || step.nameAr)
                  return (
                    <Link
                      key={step.id}
                      href={`/standards/${category}/${standardSlug}/${controlSlug}/${safeguardSlug}/${techniqueSlug}/${stepSlug}`}
                      className="block"
                    >
                      <div className="bg-card hover:bg-muted/50 rounded-lg p-6 border border-border transition-all duration-200 hover:shadow-md hover:border-green-300 dark:hover:border-green-700">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                              {step.orderNum}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {language === "ar" ? step.nameAr || step.nameEn : step.nameEn || step.nameAr}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">
                            {language === "ar"
                              ? step.descriptionAr || step.descriptionEn
                              : step.descriptionEn || step.descriptionAr}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <ChevronLeft className={`h-5 w-5 text-muted-foreground ${isRtl ? "rotate-180" : ""}`} />
                        </div>
                      </div>
                    </div>
                  </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-8 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-xl border border-green-200 dark:border-green-800">
                  <Zap className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    {language === "ar"
                      ? "لا توجد خطوات تنفيذ متاحة لهذه التقنية حالياً"
                      : "No implementation steps available for this technique yet"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
