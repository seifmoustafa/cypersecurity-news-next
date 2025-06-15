"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useArticles } from "@/core/hooks/use-articles"
import { slugify } from "@/lib/utils"

const ITEMS_PER_PAGE = 12

export default function ArticlesPageClient() {
  const { language, isRtl } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const { articles, loading, error } = useArticles(currentPage, ITEMS_PER_PAGE)

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {language === "ar" ? "خطأ في تحميل المقالات" : "Error Loading Articles"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar" ? "حدث خطأ أثناء تحميل المقالات" : "An error occurred while loading articles"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
          <Link
            href="/"
            className={`inline-flex items-center text-primary hover:text-primary/80 transition-colors ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            {isRtl ? <ChevronRight className="h-4 w-4 mr-1" /> : <ChevronLeft className="h-4 w-4 mr-1" />}
            {language === "ar" ? "رجوع إلى الرئيسية" : "Back to Home"}
          </Link>
        </div>

        {/* Header */}
        <div className={`mb-12 ${isRtl ? "text-right" : "text-left"}`}>
          <div className={`flex items-center gap-4 mb-4 ${isRtl ? "flex-row-reverse justify-end" : "justify-start"}`}>
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {language === "ar" ? "المقالات" : "Articles"}
            </h1>
          </div>
          <p className={`text-lg text-muted-foreground max-w-2xl ${isRtl ? "mr-auto" : "ml-auto"}`}>
            {language === "ar"
              ? "استعرض جميع المقالات والرؤى المتعلقة بالأمن السيبراني"
              : "Browse all cybersecurity articles and insights"}
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Card key={index} className="h-[400px] animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className={`text-center py-20 ${isRtl ? "text-right" : "text-left"}`}>
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{language === "ar" ? "لا توجد مقالات" : "No Articles Found"}</h3>
            <p className="text-muted-foreground">
              {language === "ar" ? "لم يتم العثور على أي مقالات" : "No articles were found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {articles.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={isRtl ? "flex-row-reverse" : ""}
              >
                {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {language === "ar" ? "السابق" : "Previous"}
              </Button>
              <span className="px-4 py-2 text-sm font-medium">
                {language === "ar" ? `صفحة ${currentPage}` : `Page ${currentPage}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={articles.length < ITEMS_PER_PAGE}
                className={isRtl ? "flex-row-reverse" : ""}
              >
                {language === "ar" ? "التالي" : "Next"}
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ArticleCardProps {
  article: any
  index: number
}

function ArticleCard({ article, index }: ArticleCardProps) {
  const { language, isRtl } = useLanguage()

  // Get title for display based on current language
  const displayTitle =
    language === "ar" ? article.title || article.titleEn || "" : article.titleEn || article.title || ""

  // Get summary for display
  const displaySummary =
    language === "ar" ? article.summary || article.summaryEn || "" : article.summaryEn || article.summary || ""

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = article.titleEn || article.title || ""
  const slug = slugify(englishTitle)

  // Don't render if no title
  if (!displayTitle) {
    return null
  }

  // Clean HTML tags and check for valid summary
  const cleanSummary = displaySummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/articles/${slug}`} className="group">
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
          <div className="relative h-48">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}
            >
              {new Date(article.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
            </div>
          </div>

          <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{hasValidSummary ? cleanSummary : ""}</p>
            <div className="mt-auto inline-flex items-center text-primary font-medium">
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
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
