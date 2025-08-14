"use client"

import MainLayout from "@/components/layouts/main-layout"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { container } from "@/core/di/container"
import { slugify } from "@/lib/utils"
import type { News } from "@/entities"

export default function NewsPage() {
  const { language, isRtl, t } = useLanguage()
  const [allNews, setAllNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setLoading(true)
        console.log("🔍 Fetching ALL news from API...")
        const data = await container.services.news.getNewsByCategory(null, 1, 100)
        console.log(`✅ Fetched ${data.length} real news items from API`)
        setAllNews(data)
      } catch (error) {
        console.error("❌ Error fetching all news:", error)
        setAllNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllNews()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                {t("news.allTitle")}
              </h1>
              <p className="text-xl text-foreground/80">
                {t("news.allSubtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="bg-card border rounded-lg overflow-hidden h-[400px] animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {t("news.allTitle")}
            </h1>
            <p className="text-xl text-foreground/80">
              {t("news.allSubtitle")}
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              {language === "ar" ? `${allNews.length} خبر متاح` : `${allNews.length} news articles available`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>

          {allNews.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t("news.noNews")}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function NewsCard({ item }: { item: News }) {
  const { language, isRtl, t } = useLanguage()

  // Get title for DISPLAY based on language
  const getDisplayTitle = (i: News) => {
    if (language === "ar") {
      return i?.title || i?.titleEn || ""
    }
    return i?.titleEn || i?.title || ""
  }

  // Get SUMMARY ONLY (not content) for DISPLAY based on language
  const getDisplaySummary = (i: News) => {
    if (language === "ar") {
      return i?.summary || i?.summaryEn || ""
    }
    return i?.summaryEn || i?.summary || ""
  }

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = item?.titleEn || item?.title || ""
  const slug = slugify(englishTitle)

  const displayTitle = getDisplayTitle(item)
  const displaySummary = getDisplaySummary(item)
  const date = item?.date ? new Date(item.date) : item?.createdAt ? new Date(item.createdAt) : new Date()

  // Don't render if no title
  if (!displayTitle) {
    return null
  }

  // Clean HTML tags from summary
  const cleanSummary = displaySummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  return (
    <Link href={`/news/${slug}`} className="group">
      <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item?.imageUrl || "/placeholder.svg"}
            alt={displayTitle}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}
          >
            {date.toLocaleDateString("en-US")}
          </div>
        </div>

        <div className={`p-4 flex-1 flex flex-col ${isRtl ? "text-right" : "text-left"}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {displayTitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{hasValidSummary ? cleanSummary : ""}</p>
          <div className="mt-auto">
            <span className="text-primary font-medium inline-flex items-center">
              {t("common.readMore")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
