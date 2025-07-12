"use client"

import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Shield, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Standard, Control } from "@/core/domain/models/standard"
import { slugify } from "@/lib/utils"

export default function StandardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StandardPageContent />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  )
}

function StandardPageContent() {
  const params = useParams()
  const category = params.category as string
  const standardSlug = params.standard as string
  const { language, isRtl } = useLanguage()
  const [standard, setStandard] = useState<Standard | null>(null)
  const [controls, setControls] = useState<Control[]>([])
  const [loading, setLoading] = useState(true)
  const [controlsLoading, setControlsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStandard = async () => {
      try {
        setLoading(true)
        setError(null)

        const standardsService = container.standardsService

        if (!standardsService) {
          throw new Error("Standards service not available")
        }

        const allStandards = await standardsService.getAllStandards()
        const foundStandard = allStandards.find((s) => {
          const slugEn = slugify(s.nameEn)
          const slugAr = slugify(s.nameAr)

          return (
            slugEn === standardSlug ||
            slugAr === standardSlug ||
            s.id === standardSlug
          )
        })

        if (!foundStandard) {
          notFound()
          return
        }

        setStandard(foundStandard)

        // Fetch controls for this standard
        setControlsLoading(true)
        try {
          const controlsResponse = await standardsService.getControlsByStandardId(foundStandard.id)
          setControls(controlsResponse.data || [])
        } catch (controlsError) {
          console.error("Error fetching controls:", controlsError)
          setControls([])
        } finally {
          setControlsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching standard:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch standard")
      } finally {
        setLoading(false)
      }
    }

    if (standardSlug) {
      fetchStandard()
    }
  }, [standardSlug])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">{language === "ar" ? "حدث خطأ" : "Error Occurred"}</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {language === "ar" ? "إعادة المحاولة" : "Try Again"}
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!standard) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/standards/${category}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى المعايير" : "Back to Standards"}</span>
                </Button>
              </Link>
            </div>

            {/* Standard Title Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className={`text-3xl font-bold mb-3 ${isRtl ? "text-right" : "text-left"}`}>
                      {language === "ar" ? standard.nameAr : standard.nameEn}
                    </h1>
                    <p
                      className={`text-lg text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
                    >
                      {language === "ar" ? standard.descriptionAr : standard.descriptionEn}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="secondary" className="gap-2">
                        <FileText className="h-3 w-3" />
                        {language === "ar" ? standard.category?.nameAr : standard.category?.nameEn}
                      </Badge>
                      <Badge variant="outline" className="gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(standard.createdAt).getFullYear()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                {language === "ar" ? "الضوابط الأمنية" : "Security Controls"}
              </h2>
              {controls.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {controls.length} {language === "ar" ? "ضابط" : "Controls"}
                </Badge>
              )}
            </div>

            {controlsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-32">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-5 bg-muted rounded w-2/3"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : controls.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {language === "ar" ? "لا توجد ضوابط متاحة" : "No Controls Available"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "لم يتم العثور على ضوابط أمنية لهذا المعيار حالياً"
                      : "No security controls found for this standard currently"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {controls.map((control, index) => (
                  <Link
                    href={`/standards/${category}/${standardSlug}/${slugify(
                      control.nameEn || control.nameAr || "",
                    )}`}
                    key={control.id}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <Badge variant="secondary" className="font-mono text-xs shrink-0">
                            {control.code}
                          </Badge>
                          <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                          </div>
                        </div>
                        <CardTitle className={`text-lg leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                          {language === "ar" ? control.nameAr : control.nameEn}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p
                          className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                        >
                          {language === "ar" ? control.descriptionAr : control.descriptionEn}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {language === "ar" ? `الضابط ${index + 1}` : `Control ${index + 1}`}
                          </span>
                          <div className="w-2 h-2 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
