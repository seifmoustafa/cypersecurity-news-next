"use client"

import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Control, Standard, Safeguard, SafeguardsPaginatedResponse } from "@/core/domain/models/standard"

export default function ControlPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ControlPageContent />
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

function ControlPageContent() {
  const params = useParams()
  const category = params.category as string
  const standardSlug = params.standard as string
  const controlSlug = params.control as string
  const { language, isRtl } = useLanguage()
  const [control, setControl] = useState<Control | null>(null)
  const [standard, setStandard] = useState<Standard | null>(null)
  const [safeguards, setSafeguards] = useState<SafeguardsPaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [safeguardsLoading, setSafeguardsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const standardsService = container.standardsService

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("🔍 Fetching data for:", { category, standardSlug, controlSlug })

        if (!standardsService) {
          throw new Error("Standards service not available")
        }

        // First get all standards to find the matching one
        console.log("📋 Fetching all standards...")
        const allStandards = await standardsService.getAllStandards()
        console.log("✅ Found standards:", allStandards.length)

        const foundStandard = allStandards.find((s) => {
          const slugEn =
            s.nameEn
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "") || ""
          const slugAr =
            s.nameAr
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "") || ""
          return (
            slugEn === standardSlug ||
            slugAr === standardSlug ||
            s.id === standardSlug
          )
        })

        if (!foundStandard) {
          console.error("❌ Standard not found for slug:", standardSlug)
          notFound()
          return
        }

        console.log("✅ Found standard:", foundStandard.nameEn)
        setStandard(foundStandard)

        // Then get controls for this standard
        console.log("🔧 Fetching controls for standard:", foundStandard.id)
        const controlsResponse = await standardsService.getControlsByStandardId(foundStandard.id, 1, 100)
        console.log("✅ Found controls:", controlsResponse.data.length)

        const foundControl = controlsResponse.data.find((c) => {
          const slugEn =
            c.nameEn
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "") || ""
          const slugAr =
            c.nameAr
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "") || ""
          return (
            slugEn === controlSlug ||
            slugAr === controlSlug ||
            c.id === controlSlug
          )
        })

        if (!foundControl) {
          console.error("❌ Control not found for slug:", controlSlug)
          notFound()
          return
        }

        console.log("✅ Found control:", foundControl.nameEn)
        setControl(foundControl)

        // Fetch safeguards for this control
        console.log("🛡️ Fetching safeguards for control:", foundControl.id)
        setSafeguardsLoading(true)
        try {
          const safeguardsResponse = await standardsService.getSafeguardsByControlId(foundControl.id, 1, 20)
          console.log("✅ Found safeguards:", safeguardsResponse.data.length)
          setSafeguards(safeguardsResponse)
        } catch (safeguardError) {
          console.warn("⚠️ Error fetching safeguards:", safeguardError)
          // Set empty safeguards instead of failing
          setSafeguards({
            data: [],
            pagination: {
              itemsCount: 0,
              pagesCount: 0,
              pageSize: 20,
              currentPage: 1,
            },
          })
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error)
        setError(error instanceof Error ? error.message : "Failed to load data")
      } finally {
        setLoading(false)
        setSafeguardsLoading(false)
      }
    }

    if (standardSlug && controlSlug) {
      fetchData()
    }
  }, [standardSlug, controlSlug, standardsService])

  const handleSafeguardClick = (safeguard: Safeguard) => {
    const safeguardSlug = (safeguard.nameEn || safeguard.nameAr || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")

    console.log("🔗 Navigating to safeguard:", safeguardSlug)
    window.location.href = `/standards/${category}/${standardSlug}/${controlSlug}/${safeguardSlug}`
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 flex flex-col justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!control || !standard) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/standards/${category}/${standardSlug}`}>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى المعيار" : "Back to Standard"}</span>
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-mono font-semibold">
                    {control.code || "N/A"}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {language === "ar" ? control.nameAr || control.nameEn : control.nameEn || control.nameAr}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === "ar"
                  ? control.descriptionAr || control.descriptionEn
                  : control.descriptionEn || control.descriptionAr}
              </p>
            </div>
          </div>

          {/* Safeguards Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">{language === "ar" ? "الإجراءات الوقائية" : "Safeguards"}</h2>
              {safeguards && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {safeguards.pagination.itemsCount}
                </span>
              )}
            </div>

            {safeguardsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : safeguards && safeguards.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeguards.data.map((safeguard) => (
                  <div
                    key={safeguard.id}
                    onClick={() => handleSafeguardClick(safeguard)}
                    className="group bg-card rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono font-semibold">
                        {safeguard.code || "N/A"}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {language === "ar" ? safeguard.nameAr || safeguard.nameEn : safeguard.nameEn || safeguard.nameAr}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {language === "ar"
                        ? safeguard.descriptionAr || safeguard.descriptionEn
                        : safeguard.descriptionEn || safeguard.descriptionAr}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{language === "ar" ? "إجراء وقائي" : "Safeguard"}</span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></div>
                          <div className="w-1.5 h-1.5 bg-primary/20 rounded-full group-hover:bg-primary/70 transition-colors"></div>
                          <div className="w-1.5 h-1.5 bg-primary/10 rounded-full group-hover:bg-primary/40 transition-colors"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === "ar" ? "لا توجد إجراءات وقائية" : "No Safeguards Available"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "لم يتم العثور على إجراءات وقائية لهذا الضابط حالياً"
                    : "No safeguards found for this control at the moment"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
