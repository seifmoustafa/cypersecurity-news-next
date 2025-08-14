"use client"

import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Suspense } from "react"
import { container } from "@/core/di/container"
import { slugify } from "@/lib/utils"
import type { News } from "@/entities"

export default function NewsCategoryPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewsCategoryContent />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg">Loading category news...</div>
      </div>
    </MainLayout>
  )
}

function NewsCategoryContent() {
  const params = useParams()
  const categoryUrl = params.category as string
  const { language, isRtl } = useLanguage()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryInfo, setCategoryInfo] = useState<any>(null)

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`🔍 Fetching news for category URL: ${categoryUrl}`)

        // Fetch all available categories from API
        let apiCategories: any[] = []
        try {
          apiCategories = await container.services.news.getNewsCategories()
          console.log(
            `📡 Available API categories:`,
            apiCategories.map((cat) => ({ id: cat.id, name: cat.name, nameEn: cat.nameEn })),
          )
        } catch (apiError) {
          console.warn(`⚠️ Could not fetch categories from API:`, apiError)
        }

        // Try to find matching category in API data - PRIORITIZE ENGLISH NAMES
        let foundCategory = null
        let categoryIdToUse = null

        const matchedApiCategory = apiCategories.find((cat: any) => {
          // ALWAYS try to match against English name first
          const nameEnSlug = slugify(cat.nameEn || cat.name || "")
          const nameSlug = slugify(cat.name || cat.nameEn || "")

          // Prioritize English name matching
          const matches = categoryUrl === nameEnSlug || categoryUrl === nameSlug

          if (matches) {
            console.log(`✅ Found matching API category: ${cat.nameEn || cat.name} (ID: ${cat.id})`)
          }
          return matches
        })

        if (matchedApiCategory) {
          foundCategory = {
            id: matchedApiCategory.id,
            ar: matchedApiCategory.name || matchedApiCategory.nameEn,
            en: matchedApiCategory.nameEn || matchedApiCategory.name,
          }
          categoryIdToUse = matchedApiCategory.id
        } else {
          // Fallback: show all news with a generic category name
          console.log(`⚠️ Category "${categoryUrl}" not found in API, showing all news`)
          foundCategory = {
            id: null,
            ar: categoryUrl.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            en: categoryUrl.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          }
          categoryIdToUse = null // Will fetch all news
        }

        setCategoryInfo(foundCategory)
        console.log(`✅ Using category:`, foundCategory)

        // Fetch news from API only
        console.log(`📡 Fetching news with category ID: ${categoryIdToUse || "null (all news)"}`)
        try {
          const newsData = await container.services.news.getNewsByCategory(categoryIdToUse, 1, 100)
          console.log(`✅ Successfully fetched ${newsData.length} real news items from API`)
          setNews(newsData)
        } catch (apiError) {
          console.error(`❌ Failed to fetch news:`, apiError)
          setError(`Unable to load news for this category`)
          setNews([])
        }
      } catch (error) {
        console.error("❌ Error in fetchCategoryNews:", error)
        setError("An error occurred while loading the category")
        setNews([])
        setCategoryInfo({
          id: null,
          ar: categoryUrl.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          en: categoryUrl.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryNews()
  }, [categoryUrl])

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {categoryInfo?.[language] || categoryUrl.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
            <h2 className="text-xl text-foreground/80">
              {categoryInfo && (language === "ar" ? categoryInfo.en : categoryInfo.ar)}
            </h2>
            {!loading && !error && (
              <div className="mt-4 text-sm text-muted-foreground">
                {language === "ar" ? `${news.length} خبر متاح` : `${news.length} news articles available`}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
              <p className="text-muted-foreground mb-6">
                {language === "ar"
                  ? "حدث خطأ أثناء تحميل أخبار هذه الفئة"
                  : "There was an error loading news for this category"}
              </p>
              <Link
                href="/news"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
              >
                {language === "ar" ? "عرض جميع الأخبار" : "View All News"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {language === "ar" ? `لا توجد أخبار متاحة حالياً` : `No news available at the moment`}
              </p>
              <Link
                href="/news"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
              >
                {language === "ar" ? "عرض جميع الأخبار" : "View All News"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function NewsCard({ item }: { item: News }) {
  const { language, isRtl } = useLanguage()

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
              {language === "ar" ? "اقرأ المزيد" : "Read More"}
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
