"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Shield, Search, Calendar, List, Eye, Download } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { ProcedureTechnique } from "@/core/domain/models/procedure"
import { slugify, getLocalizedText, purifyHtml, isValidHtmlContent } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import { useProcedureImplementationSteps } from "@/core/hooks/use-procedure-implementation-steps"
import Image from "next/image"

export default function TechniqueDetailPageClient() {
  const params = useParams()
  const procedureSlug = params.procedure as string
  const controlSlug = params.control as string
  const safeguardSlug = params.safeguard as string
  const techniqueSlug = params.technique as string
  const { language, isRtl } = useLanguage()
  const [technique, setTechnique] = useState<ProcedureTechnique | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchTechnique = async () => {
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

        // Get all safeguards for this control to find the safeguard
        const safeguardsResponse = await proceduresService.getSafeguardsByControlId(foundControl.id, 1, 100)
        const foundSafeguard = safeguardsResponse.data.find((s: any) => {
          const slugEn = slugify(s.nameEn || "", s.id)
          const slugAr = slugify(s.nameAr || "", s.id)
          return slugEn === safeguardSlug || slugAr === safeguardSlug || s.id === safeguardSlug
        })

        if (!foundSafeguard) {
          notFound()
          return
        }

        // Get all techniques for this safeguard to find the technique
        const techniquesResponse = await proceduresService.getTechniquesBySafeguardId(foundSafeguard.id, 1, 100)
        const foundTechnique = techniquesResponse.data.find((t: any) => {
          const slugEn = slugify(t.nameEn || "", t.id)
          const slugAr = slugify(t.nameAr || "", t.id)
          return slugEn === techniqueSlug || slugAr === techniqueSlug || t.id === techniqueSlug
        })

        if (!foundTechnique) {
          notFound()
          return
        }

        setTechnique(foundTechnique)
      } catch (error) {
        console.error("Error fetching technique:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch technique")
      } finally {
        setLoading(false)
      }
    }

    if (procedureSlug && controlSlug && safeguardSlug && techniqueSlug) {
      fetchTechnique()
    }
  }, [procedureSlug, controlSlug, safeguardSlug, techniqueSlug])

  // Use the hook for implementation steps
  const { implementationSteps, loading: stepsLoading, error: stepsError, pagination } = useProcedureImplementationSteps(
    technique?.id || "",
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

  if (!technique) {
    notFound()
  }

  const title = getLocalizedText(language, technique.nameAr, technique.nameEn)
  const description = getLocalizedText(language, technique.descriptionAr, technique.descriptionEn)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/procedures/${procedureSlug}/${controlSlug}/${safeguardSlug}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الضمان" : "Back to Safeguard"}</span>
                </Button>
              </Link>
            </div>

            {/* Technique Title Card */}
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
                        {technique.code}
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
                         {new Date(technique.createdAt).toLocaleDateString("en-US", {
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

          {/* Implementation Steps Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <List className="h-5 w-5 text-primary" />
                </div>
                {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
              </h2>
              {implementationSteps.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {pagination.itemsCount} {language === "ar" ? "خطوة" : "Steps"}
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "البحث في خطوات التنفيذ..." : "Search implementation steps..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>

            {stepsLoading ? (
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
            ) : implementationSteps.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {language === "ar" ? "لا توجد خطوات تنفيذ متاحة" : "No Implementation Steps Available"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "لم يتم العثور على خطوات تنفيذ لهذه التقنية حالياً"
                      : "No implementation steps found for this technique currently"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {implementationSteps.map((step, index) => {
                     // Clean HTML tags from description
                     const cleanDescription = purifyHtml(getLocalizedText(language, step.descriptionAr, step.descriptionEn))
                     const hasValidDescription = isValidHtmlContent(getLocalizedText(language, step.descriptionAr, step.descriptionEn))
                     
                     return (
                       <Card key={step.id} className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 group border-l-4 border-l-primary/20 hover:border-l-primary">
                         {/* Image Preview */}
                         {step.imageUrl && (
                           <div className="relative h-32 overflow-hidden rounded-t-lg">
                             <Image
                               src={step.imageUrl}
                               alt={getLocalizedText(language, step.nameAr, step.nameEn)}
                               fill
                               className="object-cover transition-transform duration-300 group-hover:scale-105"
                               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                             />
                           </div>
                         )}
                         
                         <CardHeader className="pb-3">
                           <div className="flex items-start justify-between gap-3">
                             <Badge variant="secondary" className="font-mono text-xs shrink-0">
                               Step {step.orderNum + 1}
                             </Badge>
                           </div>
                           <CardTitle className={`text-lg leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                             {getLocalizedText(language, step.nameAr, step.nameEn)}
                           </CardTitle>
                         </CardHeader>
                         
                         <CardContent className="pt-0">
                           {hasValidDescription ? (
                             <div 
                               className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                               dangerouslySetInnerHTML={{ 
                                 __html: getLocalizedText(language, step.descriptionAr, step.descriptionEn) 
                               }}
                             />
                           ) : (
                             <p className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}>
                               {language === "ar" ? "لا يوجد وصف متاح" : "No description available"}
                             </p>
                           )}
                           
                           <div className="mt-4 flex items-center justify-between">
                             <span className="text-xs text-muted-foreground">
                               {language === "ar" ? `الخطوة ${step.orderNum + 1}` : `Step ${step.orderNum + 1}`}
                             </span>
                           </div>
                           
                           {/* Action Buttons */}
                           <div className="mt-4 flex items-center gap-2">
                             <Link
                               href={`/procedures/${procedureSlug}/${controlSlug}/${safeguardSlug}/${techniqueSlug}/${slugify(step.nameEn || step.nameAr || "", step.id)}`}
                               className="flex-1"
                             >
                               <Button variant="default" size="sm" className="w-full gap-1">
                                 <Eye className="h-3 w-3" />
                                 {language === "ar" ? "عرض" : "View"}
                               </Button>
                             </Link>
                             
                             {step.documentUrl && (
                               <Button
                                 variant="default"
                                 size="sm"
                                 className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                 onClick={(e) => {
                                   e.preventDefault()
                                   window.open(step.documentUrl, "_blank")
                                 }}
                               >
                                 <Download className="h-3 w-3" />
                                 {language === "ar" ? "تحميل" : "Download"}
                               </Button>
                             )}
                           </div>
                         </CardContent>
                       </Card>
                     )
                   })}
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
