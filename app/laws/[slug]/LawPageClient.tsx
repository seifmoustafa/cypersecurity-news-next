"use client"
import Link from "next/link"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar, Tag, Download, Building } from "lucide-react"
import type { Law } from "@/core/domain/models/law"
import type { LawCategory } from "@/core/domain/models/law-category"
import { slugify } from "@/lib/utils"

interface LawPageClientProps {
  law: Law
  category: LawCategory | null
}

export default function LawPageClient({ law, category }: LawPageClientProps) {
  const { language, isRtl } = useLanguage()

  // Get content based on language
  const getTitle = (item: Law) => {
    return language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""
  }

  const getSummary = (item: Law) => {
    return language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""
  }

  const getContent = (item: Law) => {
    return language === "ar" ? item.content || item.contentEn || "" : item.contentEn || item.content || ""
  }

  const getCategoryName = () => {
    if (!category) return ""
    return language === "ar" ? category.name : category.nameEn
  }

  const getCategorySlug = () => {
    if (!category) return ""
    const categoryName = category.nameEn || category.name || ""
    return slugify(categoryName)
  }

  const lawTitle = getTitle(law)
  const lawSummary = getSummary(law)
  const lawContent = getContent(law)

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDownload = () => {
    if (law.documentUrl) {
      window.open(law.documentUrl, "_blank")
    }
  }

  const backUrl = category ? `/laws/category/${getCategorySlug()}` : "/#standards"

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <div className="mb-6">
            <Link href={backUrl}>
              <Button variant="outline" size="sm">
                {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                {category
                  ? `${language === "ar" ? "العودة للمعايير" : "Back to"} ${getCategoryName()}`
                  : language === "ar"
                    ? "العودة للمعايير"
                    : "Back to Standards"}
              </Button>
            </Link>
          </div>

          {/* Law header */}
          <article className={`${isRtl ? "text-right" : "text-left"}`}>
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">{lawTitle}</h1>

              {/* Meta information */}
              <div
                className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 ${isRtl ? "justify-end" : "justify-start"}`}
              >
                {law.effectiveDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(law.effectiveDate)}</span>
                  </div>
                )}
                {category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{getCategoryName()}</span>
                  </div>
                )}
                {law.jurisdiction && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{law.jurisdiction}</span>
                  </div>
                )}
              </div>

              {/* Summary */}
              {lawSummary && (
                <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 rounded-lg p-4 mb-6">
                  <p className="text-lg text-foreground/90 leading-relaxed">{lawSummary}</p>
                </div>
              )}
            </header>

            {/* Law content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="text-foreground leading-relaxed">
                {lawContent.split("\n").map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ),
                )}
              </div>
            </div>

            {/* Additional Law Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{language === "ar" ? "التواريخ المهمة" : "Important Dates"}</h3>

                {law.enactmentDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{language === "ar" ? "تاريخ الإصدار" : "Enactment Date"}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(law.enactmentDate)}</p>
                    </div>
                  </div>
                )}

                {law.issueDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{language === "ar" ? "تاريخ الإصدار" : "Issue Date"}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(law.issueDate)}</p>
                    </div>
                  </div>
                )}

                {law.effectiveDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{language === "ar" ? "تاريخ النفاذ" : "Effective Date"}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(law.effectiveDate)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {law.tags && law.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{language === "ar" ? "العلامات" : "Tags"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {law.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Download */}
            {law.documentUrl && (
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <div className={`flex items-center justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <h3 className="font-semibold mb-1">{language === "ar" ? "وثيقة القانون" : "Law Document"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? "تحميل النسخة الكاملة من القانون" : "Download the complete law document"}
                    </p>
                  </div>
                  <Button onClick={handleDownload}>
                    <Download className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                    {language === "ar" ? "تحميل" : "Download"}
                  </Button>
                </div>
              </div>
            )}

            {/* Law footer */}
            <footer className="mt-12 pt-8 border-t border-border">
              <div className={`flex justify-between items-center ${isRtl ? "flex-row-reverse" : ""}`}>
                <Link href={backUrl}>
                  <Button variant="outline">
                    {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                    {category
                      ? `${language === "ar" ? "العودة إلى" : "Back to"} ${getCategoryName()}`
                      : language === "ar"
                        ? "العودة للمعايير"
                        : "Back to Standards"}
                  </Button>
                </Link>

                <div className="text-sm text-muted-foreground">
                  {language === "ar" ? "تم النشر في" : "Published on"} {law.createdAt && formatDate(law.createdAt)}
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </MainLayout>
  )
}
