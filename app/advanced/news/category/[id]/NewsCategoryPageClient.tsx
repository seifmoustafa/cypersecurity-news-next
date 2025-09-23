"use client"

import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import type { News } from "@/core/domain/models/news"

interface NewsCategoryPageClientProps {
  category: {
    id: string
    name: string
    nameEn: string
  }
  news: News[]
}

export default function NewsCategoryPageClient({ category, news }: NewsCategoryPageClientProps) {
  const { language, isRtl } = useLanguage()

  const displayCategoryName = language === "ar" ? category.name : category.nameEn

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{displayCategoryName}</h1>
            <h2 className="text-xl text-foreground/80">
              {language === "ar" ? category.nameEn : category.name}
            </h2>
            <div className="mt-4 text-sm text-muted-foreground">
              {language === "ar" ? `${news.length} خبر متاح` : `${news.length} news articles available`}
            </div>
          </div>

          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {language === "ar" ? `لا توجد أخبار متاحة حالياً` : `No news available at the moment`}
              </p>
              <Link
                href="/advanced/news"
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
    <Link href={`/advanced/news/${item.id}`} className="group">
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
