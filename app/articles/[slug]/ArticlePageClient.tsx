"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/entities"

interface ArticlePageClientProps {
  article: Article
}

export default function ArticlePageClient({ article }: ArticlePageClientProps) {
  const { language, isRtl } = useLanguage()

  // Get content based on current language
  const displayTitle =
    language === "ar" ? article.title || article.titleEn || "" : article.titleEn || article.title || ""
  const displayContent =
    language === "ar" ? article.content || article.contentEn || "" : article.contentEn || article.content || ""
  const displaySummary =
    language === "ar" ? article.summary || article.summaryEn || "" : article.summaryEn || article.summary || ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
          <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRtl ? "flex-row-reverse" : ""}`}>
            <Link href="/" className="hover:text-primary transition-colors">
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span>{isRtl ? "←" : "→"}</span>
            <Link href="/articles" className="hover:text-primary transition-colors">
              {language === "ar" ? "المقالات" : "Articles"}
            </Link>
            <span>{isRtl ? "←" : "→"}</span>
            <span className="text-foreground font-medium line-clamp-1">{displayTitle}</span>
          </div>
        </div>

        {/* Back Button */}
        <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
          <Link href="/articles">
            <Button variant="outline" className={`${isRtl ? "flex-row-reverse" : ""}`}>
              {isRtl ? <ChevronRight className="h-4 w-4 mr-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
              {language === "ar" ? "رجوع إلى المقالات" : "Back to Articles"}
            </Button>
          </Link>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto">
          <article className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            {/* Header Image */}
            {article.imageUrl && (
              <div className="relative h-64 md:h-96">
                <Image src={article.imageUrl || "/placeholder.svg"} alt={displayTitle} fill className="object-cover" />
              </div>
            )}

            {/* Article Header */}
            <div className={`p-6 md:p-8 ${isRtl ? "text-right" : "text-left"}`}>
              <div
                className={`flex items-center gap-4 mb-6 ${isRtl ? "flex-row-reverse justify-end" : "justify-start"}`}
              >
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-2 text-sm text-muted-foreground ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{displayTitle}</h1>

              {displaySummary && <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{displaySummary}</p>}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className={`flex flex-wrap gap-2 mb-8 ${isRtl ? "justify-end" : "justify-start"}`}>
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className={`px-6 md:px-8 pb-8 ${isRtl ? "text-right" : "text-left"}`}>
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            </div>

            {/* Article Footer */}
            <div
              className={`px-6 md:px-8 pb-6 border-t border-gray-200 dark:border-gray-700 ${isRtl ? "text-right" : "text-left"}`}
            >
              <div className={`flex items-center justify-between pt-6 ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className={`text-sm text-muted-foreground ${isRtl ? "text-right" : "text-left"}`}>
                  <p>
                    {language === "ar" ? "تاريخ النشر: " : "Published: "}
                    {new Date(article.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                  </p>
                  {article.updatedAt && (
                    <p>
                      {language === "ar" ? "آخر تحديث: " : "Last updated: "}
                      {new Date(article.updatedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                    </p>
                  )}
                </div>
                <Link href="/articles">
                  <Button variant="outline" size="sm" className={`${isRtl ? "flex-row-reverse" : ""}`}>
                    {isRtl ? <ChevronRight className="h-4 w-4 mr-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                    {language === "ar" ? "المزيد من المقالات" : "More Articles"}
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
