"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Calendar, FileText, Download, Eye } from "lucide-react"
import Link from "next/link"
import { container } from "@/core/di/container"

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

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
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
                {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
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
  const date = regulation.issueDate ? new Date(regulation.issueDate) : regulation.effectiveDate ? new Date(regulation.effectiveDate) : regulation.createdAt ? new Date(regulation.createdAt) : new Date()

  // Clean HTML tags from summary only (keep content as HTML)
  const cleanSummary = summary ? summary.replace(/<\/?[^>]+(>|$)/g, "") : ""

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/advanced/regulation">
            <Button variant="outline" size="sm">
              {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
              {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
            </Button>
          </Link>
        </div>

        {/* Article header */}
        <article className={`${isRtl ? "text-right" : "text-left"}`}>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">{title}</h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{language === "ar" ? "لائحة" : "Regulation"}</span>
              </div>
            </div>

            {/* Summary */}
            {cleanSummary && (
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 rounded-lg p-4 mb-6">
                <p className="text-lg text-foreground/90 leading-relaxed">{cleanSummary}</p>
              </div>
            )}
          </header>

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

          {/* Article footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <Link href="/advanced/regulation">
                <Button variant="outline">
                  {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                  {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
                </Button>
              </Link>

              <div className="text-sm text-muted-foreground">
                {language === "ar" ? "تم النشر في" : "Published on"}{" "}
                {date.toLocaleDateString("en-US")}
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}
