"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { container } from "@/core/di/container"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { useRegulationBreadcrumbs } from "@/hooks/use-advanced-breadcrumbs"

interface RegulationPageClientProps {
  regulationId: string
}

export default function RegulationPageClient({ regulationId }: RegulationPageClientProps) {
  const { language, isRtl } = useLanguage()
  const [regulation, setRegulation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRegulation = async () => {
      try {
        setLoading(true)
        setError(null)

        const regulationData = await container.services.regulations.getRegulationById(regulationId)

        if (!regulationData) {
          setError("Regulation not found")
          return
        }

        setRegulation(regulationData)
      } catch (error) {
        console.error("Error fetching regulation:", error)
        setError("Failed to load regulation")
      } finally {
        setLoading(false)
      }
    }

    if (regulationId) {
      fetchRegulation()
    }
  }, [regulationId])

  // Breadcrumbs - show loading state initially
  const { items: breadcrumbItems } = useRegulationBreadcrumbs(
    regulation?.regulationCategoryId,
    regulation?.categoryNameEn ?? regulation?.categoryName,
    regulation?.categoryName ?? regulation?.categoryNameEn,
    regulation?.titleEn ?? regulation?.title,
    regulation?.title ?? regulation?.titleEn
  )

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !regulation) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="py-12">
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              {language === "ar" ? "اللائحة غير موجودة" : "Regulation Not Found"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || (language === "ar" ? "لم يتم العثور على اللائحة المطلوبة" : "The requested regulation could not be found")}
            </p>
            <Link href="/advanced/regulation">
              <Button>
                {language === "ar" ? "عرض جميع اللوائح" : "View All Regulations"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const title = language === "ar" ? regulation.title || regulation.titleEn || "" : regulation.titleEn || regulation.title || ""
  const summary = language === "ar" ? regulation.summary || regulation.summaryEn || "" : regulation.summaryEn || regulation.summary || ""
  const content = language === "ar" ? regulation.content || regulation.contentEn || "" : regulation.contentEn || regulation.content || ""

  // Clean HTML tags from summary only (keep content as HTML)
  const cleanSummary = summary ? summary.replace(/<\/?[^>]+([^>]|$)/g, "") : ""

  const handleDownload = () => {
    if (regulation.documentUrl) {
      window.open(regulation.documentUrl, "_blank")
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumbs */}
        <AdvancedBreadcrumbs items={breadcrumbItems} />

        {/* Header Image */}
        {regulation.imageUrl && (
          <div className="relative h-64 md:h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={regulation.imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Article header */}
        <article className={`${isRtl ? "text-right" : "text-left"}`}>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">{title}</h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{language === "ar" ? "لائحة" : "Regulation"}</span>
              </div>
              {regulation.categoryName && (
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                    {language === "ar" ? regulation.categoryName : regulation.categoryNameEn || regulation.categoryName}
                  </span>
                </div>
              )}
            </div>

            {/* Summary */}
            {cleanSummary && (
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 rounded-lg p-4 mb-6">
                <p className="text-lg text-foreground/90 leading-relaxed">{cleanSummary}</p>
              </div>
            )}
          </header>

          {/* Document Download */}
          {regulation.documentUrl && (
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <div className={`flex items-center justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <h3 className="font-semibold mb-1">{language === "ar" ? "وثيقة اللائحة" : "Regulation Document"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? "تحميل النسخة الكاملة من اللائحة" : "Download the complete regulation document"}
                  </p>
                </div>
                <Button onClick={handleDownload}>
                  <Download className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                  {language === "ar" ? "تحميل" : "Download"}
                </Button>
              </div>
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {content ? (
              <div className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-muted-foreground italic">
                {language === "ar" ? "لا يوجد محتوى متاح لهذه اللائحة" : "No content available for this regulation"}
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
