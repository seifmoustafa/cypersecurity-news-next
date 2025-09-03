"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Shield, Search, Calendar, Code } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { ProcedureControl } from "@/core/domain/models/procedure"
import { slugify, getLocalizedText } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import { useProcedureSafeguards } from "@/core/hooks/use-procedure-safeguards"

export default function ControlDetailPageClient() {
  const params = useParams()
  const procedureSlug = params.procedure as string
  const controlSlug = params.control as string
  const { language, isRtl } = useLanguage()
  const [control, setControl] = useState<ProcedureControl | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchControl = async () => {
      try {
        setLoading(true)
        setError(null)

        const proceduresService = container.services.procedures

        if (!proceduresService) {
          throw new Error("Procedures service not available")
        }

        // Get all procedures to find the procedure
        const allProcedures = await proceduresService.getAllProcedures(1, 100)
        const foundProcedure = allProcedures.data.find((p: any) => {
          const slugEn = slugify(p.nameEn || "", p.id)
          const slugAr = slugify(p.nameAr || "", p.id)
          return slugEn === procedureSlug || slugAr === procedureSlug || p.id === procedureSlug
        })

        if (!foundProcedure) {
          notFound()
          return
        }

        // Get all controls for this procedure to find the control
        const controlsResponse = await proceduresService.getControlsByProcedureId(foundProcedure.id, 1, 100)
        const foundControl = controlsResponse.data.find((c: any) => {
          const slugEn = slugify(c.nameEn || "", c.id)
          const slugAr = slugify(c.nameAr || "", c.id)
          return slugEn === controlSlug || slugAr === controlSlug || c.id === controlSlug
        })

        if (!foundControl) {
          notFound()
          return
        }

        setControl(foundControl)
      } catch (error) {
        console.error("Error fetching control:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch control")
      } finally {
        setLoading(false)
      }
    }

    if (procedureSlug && controlSlug) {
      fetchControl()
    }
  }, [procedureSlug, controlSlug])

  // Use the hook for safeguards
  const { safeguards, loading: safeguardsLoading, error: safeguardsError, pagination } = useProcedureSafeguards(
    control?.id || "",
    currentPage,
    10,
    searchTerm
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
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

  if (!control) {
    notFound()
  }

  const title = getLocalizedText(language, control.nameAr, control.nameEn)
  const description = getLocalizedText(language, control.descriptionAr, control.descriptionEn)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/procedures/${procedureSlug}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الإجراء" : "Back to Procedure"}</span>
                </Button>
              </Link>
            </div>

            {/* Control Title Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="font-mono text-sm">
                        {control.code}
                      </Badge>
                    </div>
                    <h1 className={`text-3xl font-bold mb-3 ${isRtl ? "text-right" : "text-left"}`}>
                      {title}
                    </h1>
                    <p className={`text-lg text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                      {description || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                    </p>
                                         <div className="flex items-center gap-4 mt-4">
                       <Badge variant="outline" className="gap-2 bg-background border-primary/30 text-foreground hover:bg-primary/10 transition-colors">
                         <Calendar className="h-3 w-3" />
                         {new Date(control.createdAt).toLocaleDateString("en-US", {
                           month: "numeric",
                           day: "numeric",
                           year: "numeric"
                         })}
                       </Badge>

                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safeguards Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                {language === "ar" ? "الضمانات" : "Safeguards"}
              </h2>
              {safeguards.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {pagination.itemsCount} {language === "ar" ? "ضمان" : "Safeguards"}
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "البحث في الضمانات..." : "Search safeguards..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>

            {safeguardsLoading ? (
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
            ) : safeguards.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground text-6xl mb-4">🛡️</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {language === "ar" ? "لا توجد ضمانات متاحة" : "No Safeguards Available"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "لم يتم العثور على ضمانات لهذا الضابط حالياً"
                      : "No safeguards found for this control currently"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeguards.map((safeguard, index) => (
                    <Link
                      href={`/procedures/${procedureSlug}/${controlSlug}/${slugify(safeguard.nameEn || safeguard.nameAr || "", safeguard.id)}`}
                      key={safeguard.id}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <Badge variant="secondary" className="font-mono text-xs shrink-0">
                              {safeguard.code}
                            </Badge>
                            <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                            </div>
                          </div>
                          <CardTitle className={`text-lg leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                            {getLocalizedText(language, safeguard.nameAr, safeguard.nameEn)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p
                            className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                          >
                            {getLocalizedText(language, safeguard.descriptionAr, safeguard.descriptionEn) || 
                             (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {language === "ar" ? `الضمان ${index + 1}` : `Safeguard ${index + 1}`}
                            </span>
                            <div className="w-2 h-2 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pagesCount > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.pagesCount}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
