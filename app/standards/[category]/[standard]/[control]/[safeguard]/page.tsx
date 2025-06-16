"use client"

import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Shield, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Control, Standard, Safeguard, Technique } from "@/core/domain/models/standard"

export default function SafeguardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SafeguardPageContent />
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

function SafeguardPageContent() {
  const params = useParams()
  const category = params.category as string
  const standardSlug = params.standard as string
  const controlSlug = params.control as string
  const safeguardSlug = params.safeguard as string
  const { language, isRtl } = useLanguage()
  const [safeguard, setSafeguard] = useState<Safeguard | null>(null)
  const [control, setControl] = useState<Control | null>(null)
  const [standard, setStandard] = useState<Standard | null>(null)
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [loading, setLoading] = useState(true)
  const [techniquesLoading, setTechniquesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const standardsService = container.standardsService

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  const handleTechniqueClick = (technique: Technique) => {
    const techniqueSlug = generateSlug(technique.nameEn || technique.nameAr)
    const url = `/standards/${category}/${standardSlug}/${controlSlug}/${safeguardSlug}/${techniqueSlug}`
    console.log("🔗 Navigating to technique:", url)
    window.location.href = url
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("🔄 Starting data fetch for safeguard page...")

        // First get the standard
        const allStandards = await standardsService.getAllStandards()
        const foundStandard = allStandards.find(
          (s) => generateSlug(s.nameEn) === standardSlug || generateSlug(s.nameAr) === standardSlug,
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
          (c) => generateSlug(c.nameEn) === controlSlug || generateSlug(c.nameAr) === controlSlug,
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
          (s) => generateSlug(s.nameEn) === safeguardSlug || generateSlug(s.nameAr) === safeguardSlug,
        )

        if (!foundSafeguard) {
          console.error("❌ Safeguard not found:", safeguardSlug)
          notFound()
        }

        console.log("✅ Found safeguard:", foundSafeguard.nameEn)
        setSafeguard(foundSafeguard)

        // Finally get techniques for this safeguard
        setTechniquesLoading(true)
        try {
          const techniquesResponse = await standardsService.getTechniquesBySafeguardId(foundSafeguard.id, 1, 100)
          console.log("✅ Fetched techniques:", techniquesResponse.data.length)
          setTechniques(techniquesResponse.data)
        } catch (techniquesError) {
          console.error("⚠️ Error fetching techniques:", techniquesError)
          setTechniques([])
        } finally {
          setTechniquesLoading(false)
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (standardSlug && controlSlug && safeguardSlug) {
      fetchData()
    }
  }, [standardSlug, controlSlug, safeguardSlug, standardsService])

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

  if (!safeguard || !control || !standard) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/standards/${category}/${standardSlug}/${controlSlug}`}>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الضابط" : "Back to Control"}</span>
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-mono font-semibold">
                    {safeguard.code || "N/A"}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                {language === "ar" ? safeguard.nameAr || safeguard.nameEn : safeguard.nameEn || safeguard.nameAr}
              </h1>
              <p className="text-blue-700 dark:text-blue-300 text-lg">
                {language === "ar"
                  ? safeguard.descriptionAr || safeguard.descriptionEn
                  : safeguard.descriptionEn || safeguard.descriptionAr}
              </p>
            </div>
          </div>

          {/* Safeguard Details */}
          <div className={`mb-12 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {language === "ar" ? "تفاصيل الإجراء الوقائي" : "Safeguard Details"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {language === "ar" ? "رمز الإجراء" : "Safeguard Code"}
                  </h3>
                  <p className="font-mono bg-background px-3 py-2 rounded border border-border text-blue-800 dark:text-blue-200 font-semibold">
                    {safeguard.code || "N/A"}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    {language === "ar" ? "الضابط المرتبط" : "Related Control"}
                  </h3>
                  <p className="font-mono bg-background px-3 py-2 rounded border border-border text-green-800 dark:text-green-200 font-semibold">
                    {control.code || "N/A"} -{" "}
                    {language === "ar" ? control.nameAr || control.nameEn : control.nameEn || control.nameAr}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Techniques Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {language === "ar" ? "التقنيات" : "Techniques"}
              </h2>
            </div>

            {techniquesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48"></div>
                  </div>
                ))}
              </div>
            ) : techniques.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techniques.map((technique) => (
                  <Card
                    key={technique.id}
                    className="group cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-l-purple-500 dark:border-l-purple-400 hover:border-l-purple-600 dark:hover:border-l-purple-300"
                    onClick={() => handleTechniqueClick(technique)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-md">
                            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-mono font-semibold">
                            {technique.code || "N/A"}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={isRtl ? "text-right" : "text-left"}>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors">
                        {language === "ar"
                          ? technique.nameAr || technique.nameEn
                          : technique.nameEn || technique.nameAr}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 group-hover:text-foreground/80 transition-colors">
                        {language === "ar"
                          ? technique.descriptionAr || technique.descriptionEn
                          : technique.descriptionEn || technique.descriptionAr}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 dark:bg-purple-400 rounded-full w-0 group-hover:w-full transition-all duration-500"></div>
                        </div>
                        <span className="text-xs text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {language === "ar" ? "انقر للعرض" : "Click to view"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-8 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 rounded-xl border border-purple-200 dark:border-purple-800">
                  <Zap className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    {language === "ar" ? "لا توجد تقنيات متاحة" : "No Techniques Available"}
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300">
                    {language === "ar"
                      ? "لا توجد تقنيات مرتبطة بهذا الإجراء الوقائي حالياً"
                      : "No techniques are currently associated with this safeguard"}
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
