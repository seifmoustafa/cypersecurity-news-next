"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react"
import type { News } from "@/core/domain/models/news"

interface NewsDetailPageClientProps {
  news: News
}

export default function NewsDetailPageClient({ news }: NewsDetailPageClientProps) {
  const { language, isRtl } = useLanguage()

  // Get content based on language
  const getTitle = (item: News) => {
    return language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""
  }

  const getSummary = (item: News) => {
    return language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""
  }

  const getContent = (item: News) => {
    return language === "ar" ? item.content || item.contentEn || "" : item.contentEn || item.content || ""
  }

  const newsTitle = getTitle(news)
  const newsSummary = getSummary(news)
  const newsContent = getContent(news)
  const date = news.date ? new Date(news.date) : news.createdAt ? new Date(news.createdAt) : new Date()

  // Clean HTML tags from content
  const cleanContent = newsContent ? newsContent.replace(/<\/?[^>]+(>|$)/g, "") : ""
  const cleanSummary = newsSummary ? newsSummary.replace(/<\/?[^>]+(>|$)/g, "") : ""

  // Determine back button link - to category if categoryId exists, otherwise to news list
  const backButtonHref = news.categoryId 
    ? `/advanced/news/category/${news.categoryId}`
    : "/advanced#awareness"

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <Link href={backButtonHref}>
            <Button variant="outline" size="sm">
              {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
              {news.categoryId 
                ? (language === "ar" ? "العودة إلى الفئة" : "Back to Category")
                : (language === "ar" ? "العودة إلى الوعي الأمني" : "Back to Awareness")}
            </Button>
          </Link>
        </div>

        {/* Article header */}
        <article className={`${isRtl ? "text-right" : "text-left"}`}>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">{newsTitle}</h1>

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
              {news.category && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{news.category}</span>
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

          {/* Featured image */}
          {news.imageUrl && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={news.imageUrl || "/placeholder.svg"}
                alt={newsTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {newsContent ? (
              <div className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: newsContent }} />
            ) : (
              <p className="text-muted-foreground italic">
                {language === "ar" ? "لا يوجد محتوى متاح لهذا المقال" : "No content available for this article"}
              </p>
            )}
          </div>

          {/* Article footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <Link href={backButtonHref}>
                <Button variant="outline">
                  {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                  {news.categoryId 
                    ? (language === "ar" ? "العودة إلى الفئة" : "Back to Category")
                    : (language === "ar" ? "العودة إلى الوعي الأمني" : "Back to Awareness")}
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