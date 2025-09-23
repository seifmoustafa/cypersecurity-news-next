"use client"

import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { useState } from "react"
import type { LawCategory } from "@/core/domain/models/law-category"
import type { Law, PaginationInfo } from "@/core/domain/models/law"

interface LawCategoryPageClientProps {
  category: LawCategory
  laws: Law[]
  pagination?: PaginationInfo | null
}

export default function LawCategoryPageClient({ category, laws = [], pagination }: LawCategoryPageClientProps) {
  const { language, isRtl } = useLanguage()
  const [currentLaws] = useState<Law[]>(laws || [])

  const displayCategoryName =
    language === "ar" ? category?.name || category?.nameEn || "" : category?.nameEn || category?.name || ""

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{displayCategoryName}</h1>
            <h2 className="text-xl text-foreground/80">{language === "ar" ? category?.nameEn : category?.name}</h2>
            <div className="mt-4 text-sm text-muted-foreground">
              {language === "ar" ? `${currentLaws.length} قانون متاح` : `${currentLaws.length} laws available`}
            </div>
          </div>

          {currentLaws.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentLaws.map((law) => (
                <LawCard key={law.id} item={law} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {language === "ar" ? `لا توجد قوانين متاحة حالياً` : `No laws available at the moment`}
              </p>
              <Link
                href="/#standards"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
              >
                {language === "ar" ? "العودة للمعايير" : "Back to Standards"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function LawCard({ item }: { item: Law }) {
  const { language, isRtl } = useLanguage()

  // Get title for DISPLAY based on language
  const getDisplayTitle = (i: Law) => {
    if (language === "ar") {
      return i?.title || i?.titleEn || ""
    }
    return i?.titleEn || i?.title || ""
  }

  // Get SUMMARY ONLY (not content) for DISPLAY based on language
  const getDisplaySummary = (i: Law) => {
    if (language === "ar") {
      return i?.summary || i?.summaryEn || ""
    }
    return i?.summaryEn || i?.summary || ""
  }

  const displayTitle = getDisplayTitle(item)
  const displaySummary = getDisplaySummary(item)
  const date = item?.effectiveDate
    ? new Date(item.effectiveDate)
    : item?.createdAt
      ? new Date(item.createdAt)
      : new Date()

  // Don't render if no title
  if (!displayTitle) {
    return null
  }

  // Clean HTML tags from summary
  const cleanSummary = displaySummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  return (
    <Link href={`/laws/${item.id}`} className="group">
      <div className="bg-card border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src="/placeholder.svg?height=192&width=384"
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

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className={`flex flex-wrap gap-1 mb-4 ${isRtl ? "justify-end" : "justify-start"}`}>
              {item.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}

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
