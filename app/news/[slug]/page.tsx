"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react"
import type { News } from "@/entities"

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { language, isRtl } = useLanguage()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`🔍 Fetching news detail for slug: ${slug}`)

        // Get all news and find the one with matching slug to get its ID
        const allNews = await container.services.news.getAllNews()
        console.log(`📡 Fetched ${allNews.length} news items to search`)

        // Find news by matching slug (ALWAYS use English title for slug matching)
        const foundNews = allNews.find((item: News) => {
          const englishTitle = item.titleEn || item.title || ""
          const itemSlug = slugify(englishTitle)
          const matches = itemSlug === slug
          if (matches) {
            console.log(`✅ Found matching news: ${englishTitle} (slug: ${itemSlug}, id: ${item.id})`)
          }
          return matches
        })

        if (foundNews) {
          // Use getNewsById to get the full details
          console.log(`📡 Fetching detailed news by ID: ${foundNews.id}`)
          const newsDetail = await container.services.news.getNewsById(foundNews.id)
          if (newsDetail) {
            setNews(newsDetail)
          } else {
            setError("Failed to load news content")
          }
        } else {
          console.log(`❌ No news found for slug: ${slug}`)
          setError("News article not found")
        }
      } catch (error) {
        console.error("❌ Error fetching news detail:", error)
        setError("Failed to load news article")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchNewsDetail()
    }
  }, [slug, language])

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

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-gray-300 rounded mb-6"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !news) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="py-12">
              <h1 className="text-2xl font-bold mb-4 text-foreground">
                {language === "ar" ? "المقال غير موجود" : "Article Not Found"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {error ||
                  (language === "ar" ? "لم يتم العثور على المقال المطلوب" : "The requested article could not be found")}
              </p>
              <Link href="/news">
                <Button>
                  {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                  {language === "ar" ? "العودة إلى الأخبار" : "Back to News"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  const newsTitle = getTitle(news)
  const newsSummary = getSummary(news)
  const newsContent = getContent(news)
  const date = news.date ? new Date(news.date) : news.createdAt ? new Date(news.createdAt) : new Date()

  // Clean HTML tags from content
  const cleanContent = newsContent.replace(/<\/?[^>]+(>|$)/g, "")
  const cleanSummary = newsSummary.replace(/<\/?[^>]+(>|$)/g, "")

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/news">
              <Button variant="outline" size="sm">
                {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                {language === "ar" ? "العودة إلى الأخبار" : "Back to News"}
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
                <Link href="/news">
                  <Button variant="outline">
                    {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                    {language === "ar" ? "العودة إلى الأخبار" : "Back to News"}
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
    </MainLayout>
  )
}
