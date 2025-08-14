"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import type { Regulation } from "@/core/domain/models/regulation"
import { container } from "@/core/di/container"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar, Download, FileText, ExternalLink, Maximize2, X } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { slugify } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"

interface RegulationPageClientProps {
  regulationSlug: string
}

export default function RegulationPageClient({ regulationSlug }: RegulationPageClientProps) {
  const [regulation, setRegulation] = useState<Regulation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const { language, t, isRtl } = useLanguage()

  useEffect(() => {
    const fetchRegulation = async () => {
      try {
        setLoading(true)
        const data = await container.services.regulations.getRegulationBySlug(regulationSlug)
        setRegulation(data)
      } catch (err) {
        console.error("Error fetching regulation:", err)
        setError(t("errors.fetchFailed"))
      } finally {
        setLoading(false)
      }
    }

    fetchRegulation()
  }, [regulationSlug, t])

  const getTitle = () => {
    if (language === "ar") {
      return regulation?.title || regulation?.titleEn || ""
    }
    return regulation?.titleEn || regulation?.title || ""
  }

  const getContent = () => {
    if (language === "ar") {
      return regulation?.content || regulation?.contentEn || ""
    }
    return regulation?.contentEn || regulation?.content || ""
  }

  const getSummary = () => {
    if (language === "ar") {
      return regulation?.summary || regulation?.summaryEn || ""
    }
    return regulation?.summaryEn || regulation?.summary || ""
  }

  const getCategoryName = () => {
    if (language === "ar") {
      return regulation?.categoryName || regulation?.categoryNameEn || ""
    }
    return regulation?.categoryNameEn || regulation?.categoryName || ""
  }

  // Get category slug for the back link
  const getCategorySlug = () => {
    return regulation?.categoryNameEn
      ? slugify(regulation.categoryNameEn, regulation.regulationCategoryId)
      : "all"
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd MMMM yyyy", { locale: language === "ar" ? ar : undefined })
    } catch (e) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!regulation) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p>{t("regulation.notFound")}</p>
            <Link href="/regulation/category/all">
              <Button className="mt-4">
                {isRtl ? <ArrowRight className="mr-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                {t("common.backToList")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href={`/regulation/category/${getCategorySlug()}`}>
          <Button variant="outline" className="flex items-center gap-2">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t("common.backToList")}
          </Button>
        </Link>
      </div>

      <h1 className={`text-3xl font-bold mb-2 ${language === "ar" ? "font-arabic" : ""}`}>{getTitle()}</h1>

      <div className="flex items-center gap-4 text-muted-foreground mb-6">
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>{getCategoryName()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(regulation.issueDate)}</span>
        </div>
      </div>

      {/* Document Download Button */}
      {regulation.documentUrl && (
        <div className="mb-6">
          <Button
            variant="default"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
            onClick={() => window.open(regulation.documentUrl, "_blank")}
          >
            <Download className="h-4 w-4" />
            {t("regulation.downloadDocument")}
          </Button>
        </div>
      )}

      {/* Image with Preview */}
      {regulation.imageUrl && (
        <div className="mb-8 relative group">
          <div className="relative overflow-hidden rounded-lg shadow-md">
            <img
              src={regulation.imageUrl || "/placeholder.svg"}
              alt={getTitle()}
              className="w-full h-auto object-cover max-h-96 cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => setImagePreviewOpen(true)}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
              onClick={() => setImagePreviewOpen(true)}
            >
              <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden bg-transparent border-0">
          <div className="relative">
            <DialogClose className="absolute top-2 right-2 z-10">
              <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
            <img
              src={regulation?.imageUrl || "/placeholder.svg"}
              alt={getTitle()}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-2 ${language === "ar" ? "font-arabic" : ""}`}>
          {t("regulation.summary")}
        </h2>
        <p className={`text-muted-foreground ${language === "ar" ? "font-arabic" : ""}`}>{getSummary()}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div
            className={`prose max-w-none ${language === "ar" ? "font-arabic prose-headings:font-arabic" : ""}`}
            dangerouslySetInnerHTML={{ __html: getContent() }}
          />
        </CardContent>
      </Card>

      {/* Bottom Document Download Button */}
      {regulation.documentUrl && (
        <div className="mt-8 flex justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open(regulation.documentUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            {t("regulation.viewFullDocument")}
          </Button>
        </div>
      )}
    </div>
  )
}
