"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Shield, Calendar, FileText, Image as ImageIcon, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { ProcedureImplementationStep } from "@/core/domain/models/procedure"
import { slugify, getLocalizedText } from "@/lib/utils"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ImplementationStepDetailPageClient() {
  const params = useParams()
  const procedureSlug = params.procedure as string
  const controlSlug = params.control as string
  const safeguardSlug = params.safeguard as string
  const techniqueSlug = params.technique as string
  const implementationSlug = params.implementation as string
  const { language, isRtl } = useLanguage()
  const [implementationStep, setImplementationStep] = useState<ProcedureImplementationStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  useEffect(() => {
    const fetchImplementationStep = async () => {
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

        // Get all implementation steps for this technique to find the implementation step
        const stepsResponse = await proceduresService.getImplementationStepsByTechniqueId(foundTechnique.id, 1, 100)
        const foundStep = stepsResponse.data.find((step: any) => {
          const slugEn = slugify(step.nameEn || "", step.id)
          const slugAr = slugify(step.nameAr || "", step.id)
          return slugEn === implementationSlug || slugAr === implementationSlug || step.id === implementationSlug
        })

        if (!foundStep) {
          notFound()
          return
        }

        // Get the detailed implementation step
        const detailedStep = await proceduresService.getImplementationStepById(foundStep.id)
        if (!detailedStep) {
          notFound()
          return
        }

        setImplementationStep(detailedStep)
      } catch (error) {
        console.error("Error fetching implementation step:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch implementation step")
      } finally {
        setLoading(false)
      }
    }

    if (procedureSlug && controlSlug && safeguardSlug && techniqueSlug && implementationSlug) {
      fetchImplementationStep()
    }
  }, [procedureSlug, controlSlug, safeguardSlug, techniqueSlug, implementationSlug])

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

  if (!implementationStep) {
    notFound()
  }

  const title = getLocalizedText(language, implementationStep.nameAr, implementationStep.nameEn)
  const description = getLocalizedText(language, implementationStep.descriptionAr, implementationStep.descriptionEn)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <Link href={`/procedures/${procedureSlug}/${controlSlug}/${safeguardSlug}/${techniqueSlug}`}>
                <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى التقنية" : "Back to Technique"}</span>
                </Button>
              </Link>
            </div>

            {/* Implementation Step Title Card */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
              <CardContent className="p-10">
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="font-mono text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">
                        Step {implementationStep.orderNum + 1}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {language === "ar" ? "خطوة تنفيذ" : "Implementation Step"}
                      </Badge>
                    </div>
                    <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent ${isRtl ? "text-right" : "text-left"}`}>
                      {title}
                    </h1>
                    {description ? (
                      <div 
                        className={`text-xl text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
                        dangerouslySetInnerHTML={{ 
                          __html: getLocalizedText(language, implementationStep.descriptionAr, implementationStep.descriptionEn) 
                        }}
                      />
                    ) : (
                      <p className={`text-xl text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                        {language === "ar" ? "لا يوجد وصف متاح" : "No description available"}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-6">
                      <Badge variant="outline" className="gap-2 bg-background border-primary/30 text-foreground hover:bg-primary/10 transition-colors">
                        <Calendar className="h-3 w-3" />
                        {new Date(implementationStep.createdAt).toLocaleDateString("en-US", {
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

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Description Section */}
            {(implementationStep.descriptionAr || implementationStep.descriptionEn) && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    {language === "ar" ? "الوصف التفصيلي" : "Detailed Description"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <div 
                    className={`prose prose-lg dark:prose-invert max-w-none leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
                    dangerouslySetInnerHTML={{ 
                      __html: getLocalizedText(language, implementationStep.descriptionAr, implementationStep.descriptionEn) 
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Image Section */}
            {implementationStep.imageUrl && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    {language === "ar" ? "الصورة المرفقة" : "Attached Image"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10 border border-border/50 shadow-inner">
                    <Image
                      src={implementationStep.imageUrl}
                      alt={title}
                      fill
                      className="object-contain cursor-pointer hover:opacity-95 transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      onClick={() => setImageDialogOpen(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    <Button
                      variant="default"
                      size="sm"
                      className="absolute top-4 right-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg border border-primary/20 backdrop-blur-sm transition-all duration-200"
                      onClick={() => setImageDialogOpen(true)}
                    >
                      <Eye className="h-4 w-4" />
                      {language === "ar" ? "عرض كامل" : "Full View"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogContent className="max-w-6xl max-h-[95vh] overflow-auto bg-gradient-to-br from-background to-muted/20">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-primary" />
                    </div>
                    {title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex justify-center p-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={implementationStep.imageUrl || ""}
                      alt={title}
                      width={1000}
                      height={800}
                      className="max-w-full h-auto rounded-2xl"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Document Section */}
            {implementationStep.documentUrl && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    {language === "ar" ? "المستند المرفق" : "Attached Document"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="flex items-center justify-between p-8 border-2 border-dashed border-primary/20 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-xl text-foreground">
                          {language === "ar" ? "مستند التنفيذ" : "Implementation Document"}
                        </p>
                        <p className="text-muted-foreground mt-1">
                          {language === "ar" ? "انقر لتحميل المستند" : "Click to download document"}
                        </p>
                      </div>
                    </div>
                    <Button asChild className="gap-3 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      <a 
                        href={implementationStep.documentUrl} 
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-5 w-5" />
                        {language === "ar" ? "تحميل المستند" : "Download Document"}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
