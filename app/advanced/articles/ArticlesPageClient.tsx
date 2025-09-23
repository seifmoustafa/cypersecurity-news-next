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
import MainLayout from "@/components/layouts/main-layout"

const ITEMS_PER_PAGE = 12

export default function ArticlesPageClient() {
  const { language, isRtl, t } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const { articles, loading, error } = useArticles(currentPage, ITEMS_PER_PAGE)

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {t("articles.errorTitle")}
          </h1>
          <p className="text-muted-foreground">{t("articles.errorMessage")}</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-blue-50/30 dark:from-green-950/30 dark:via-slate-900 dark:to-blue-950/30">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Breadcrumb */}
        <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
          <Link
            href="/"
            className={`inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-blue-200/30 dark:border-blue-800/30 shadow-md shadow-blue-500/10 dark:shadow-blue-500/20 text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            {isRtl ? <ChevronRight className="h-4 w-4 mr-1" /> : <ChevronLeft className="h-4 w-4 mr-1" />}
            {t("articles.backToHome")}
          </Link>
        </div>

        {/* Enhanced Header */}
        <div className={`mb-12 ${isRtl ? "text-right" : "text-left"}`}>
          <div className={`flex items-center gap-6 mb-6 ${isRtl ? "flex-row-reverse justify-end" : "justify-start"}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg shadow-green-500/30">
                <FileText className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-600 dark:from-green-400 dark:via-blue-400 dark:to-green-400 bg-clip-text text-transparent">
              {t("articles.title")}
            </h1>
          </div>
          <div className="max-w-3xl">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/30 dark:border-green-800/30 shadow-lg shadow-green-500/10 dark:shadow-green-500/20">
              <p className={`text-lg text-muted-foreground ${isRtl ? "text-right" : "text-left"}`}>{t("articles.subtitle")}</p>
            </div>
          </div>
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
            <h3 className="text-xl font-semibold mb-2">{t("articles.noArticlesTitle")}</h3>
            <p className="text-muted-foreground">{t("articles.noArticlesDescription")}</p>
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
                {t("common.previous")}
              </Button>
              <span className="px-4 py-2 text-sm font-medium">
                {t("common.page")} {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={articles.length < ITEMS_PER_PAGE}
                className={isRtl ? "flex-row-reverse" : ""}
              >
                {t("common.next")}
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  )
}

interface ArticleCardProps {
  article: any
  index: number
}

function ArticleCard({ article, index }: ArticleCardProps) {
  const { language, isRtl,t } = useLanguage()

  // Get title for display based on current language
  const displayTitle =
    language === "ar" ? article.title || article.titleEn || "" : article.titleEn || article.title || ""

  // Get summary for display
  const displaySummary =
    language === "ar" ? article.summary || article.summaryEn || "" : article.summaryEn || article.summary || ""

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = article.titleEn 
  const slug = slugify(englishTitle, article.id)

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
      <Link href={`/advanced/articles/${article.id}`} className="group">
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
              {new Date(article.createdAt).toLocaleDateString("en-US")}
            </div>
          </div>

          <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{hasValidSummary ? cleanSummary : ""}</p>
            <div className="mt-auto inline-flex items-center text-primary font-medium">
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
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
