"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Shield, Search, Calendar } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Procedure } from "@/core/domain/models/procedure"
import { slugify, getLocalizedText } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import { useProcedureControls } from "@/core/hooks/use-procedure-controls"

export default function ProcedureDetailPageClient() {
  const params = useParams()
  const procedureSlug = params.procedure as string
  const { language, isRtl } = useLanguage()
  const [procedure, setProcedure] = useState<Procedure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        setLoading(true)
        setError(null)

        const proceduresService = container.services.procedures

        if (!proceduresService) {
          throw new Error("Procedures service not available")
        }

        // Get all procedures to find the one by slug
        const allProcedures = await proceduresService.getAllProcedures(1, 100)
        const foundProcedure = allProcedures.data.find((p) => {
          const slugEn = slugify(p.nameEn || "", p.id)
          const slugAr = slugify(p.nameAr || "", p.id)
          return slugEn === procedureSlug || slugAr === procedureSlug || p.id === procedureSlug
        })

        if (!foundProcedure) {
          notFound()
          return
        }

        setProcedure(foundProcedure)
      } catch (error) {
        console.error("Error fetching procedure:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch procedure")
      } finally {
        setLoading(false)
      }
    }

    if (procedureSlug) {
      fetchProcedure()
    }
  }, [procedureSlug])

  // Use the hook for controls
  const { controls, loading: controlsLoading, error: controlsError, pagination } = useProcedureControls(
    procedure?.id || "",
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

  if (!procedure) {
    notFound()
  }

  const title = getLocalizedText(language, procedure.nameAr, procedure.nameEn)
  const description = getLocalizedText(language, procedure.descriptionAr, procedure.descriptionEn)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/procedures">
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الإجراءات" : "Back to Procedures"}</span>
                </Button>
              </Link>
            </div>

            {/* Procedure Title Card */}
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
                      {title}
                    </h1>
                    <p className={`text-lg text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                      {description || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                    </p>
                                         <div className="flex items-center gap-4 mt-4">
                       <Badge variant="outline" className="gap-2 bg-background border-primary/30 text-foreground hover:bg-primary/10 transition-colors">
                         <Calendar className="h-3 w-3" />
                         {new Date(procedure.createdAt).toLocaleDateString("en-US", {
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

          {/* Controls Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                {language === "ar" ? "إجراءات التحكم" : "Controls"}
              </h2>
              {controls.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {pagination.itemsCount} {language === "ar" ? "إجراء التحكم" : "Controls"}
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "البحث في إجراءات التحكم..." : "Search controls..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
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
                      ? "لم يتم العثور على ضوابط لهذا الإجراء حالياً"
                      : "No controls found for this procedure currently"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {controls.map((control, index) => (
                    <Link
                      href={`/procedures/${procedureSlug}/${slugify(control.nameEn || control.nameAr || "", control.id)}`}
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
                            {getLocalizedText(language, control.nameAr, control.nameEn)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p
                            className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                          >
                            {getLocalizedText(language, control.descriptionAr, control.descriptionEn) || 
                             (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {language === "ar" ? `الإجراء التحكم ${index + 1}` : `Control ${index + 1}`}
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
