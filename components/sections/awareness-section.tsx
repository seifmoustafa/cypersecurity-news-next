"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useNewsByCategory, useNewsCategories } from "@/core/hooks/use-news"
import { useLatestArticles } from "@/core/hooks/use-articles"
import { container } from "@/core/di/container"
import { slugify } from "@/lib/utils"
import { useCurrentYearAwareness } from "@/core/hooks/use-awareness"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, FileText } from "lucide-react"

// Map category IDs to URL-friendly names
const categoryUrlMap: { [key: string]: string } = {
  dataBreaches: "data-breaches",
  cyberAttacks: "cyber-attacks",
  vulnerabilities: "vulnerabilities",
  threatIntelligence: "threat-intelligence",
}

export default function AwarenessSection() {
  const { t, language, isRtl } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("news")
  const [activeNewsCategory, setActiveNewsCategory] = useState("all")

  // Fetch real articles from API
  const { articles, loading: articlesLoading } = useLatestArticles(3)

  // Fetch categories from API
  const { categories, loading: categoriesLoading } = useNewsCategories()

  useEffect(() => {
    const fetchAwarenessData = async () => {
      try {
        setLoading(true)
      } finally {
        setLoading(false)
      }
    }
    fetchAwarenessData()
  }, [])

  // Listen for external tab-change events
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const { sectionId, tab } = (e as CustomEvent).detail || {}
      if (sectionId === "awareness" && tab) {
        setActiveTab(tab)
        if (tab === "news") setActiveNewsCategory("all")
      }
    }
    window.addEventListener("tabchange", handleTabChange)
    return () => window.removeEventListener("tabchange", handleTabChange)
  }, [])

  return (
    <SectionContainer id="awareness" className="bg-muted/30">
      <SectionHeader title={t("section.awareness")} subtitle={t("awareness.subtitle")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full max-w-md mx-auto mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
          <TabsTrigger value="news" className="flex-1">
            {language === "ar" ? "الأخبار" : "News"}
          </TabsTrigger>
          <TabsTrigger value="bulletins" className="flex-1">
            {t("awareness.bulletins")}
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex-1">
            {t("awareness.articles")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <Tabs value={activeNewsCategory} onValueChange={setActiveNewsCategory} className="w-full">
            <TabsList
              className={`w-full max-w-4xl mx-auto mb-8 flex flex-wrap justify-center ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <TabsTrigger value="all" className="flex-grow">
                {language === "ar" ? "الكل" : "All"}
              </TabsTrigger>
              {!categoriesLoading &&
                categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id} className="flex-grow">
                    {language === "ar" ? cat.name || cat.nameEn : cat.nameEn || cat.name}
                  </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="all">
              <AllNewsContent />
            </TabsContent>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <CategoryNewsContent
                  categoryId={cat.id}
                  categoryName={language === "ar" ? cat.name || cat.nameEn : cat.nameEn || cat.name}
                  categoryNameEn={cat.nameEn || cat.name}
                />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="bulletins">
          <CurrentYearAwarenessContent />
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesLoading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <Card key={i} className="h-[300px] animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))
            ) : articles.length > 0 ? (
              articles.map((item, idx) => <ArticleCard key={item.id} item={item} index={idx} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">{t("common.noData")}</p>
              </div>
            )}
            {/* View All Articles Button */}
            {articles.length > 0 && (
              <div className="col-span-full flex justify-center mt-6">
                <Link
                  href="/articles"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors"
                >
                  {language === "ar" ? "عرض جميع المقالات" : "View All Articles"}
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  )
}

// ALL NEWS CONTENT - Shows preview and "View All News" button
function AllNewsContent() {
  const { language } = useLanguage()
  const [allNews, setAllNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Get first 6 news items for preview
        const data = await container.services.news.getNewsByCategory(null, 1, 6)
        setAllNews(data)
      } catch (error) {
        console.error("Error fetching all news:", error)
        setAllNews([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[300px] animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {allNews.map((item, idx) => (
        <NewsCard key={item.id} item={item} index={idx} />
      ))}
      <div className="col-span-full flex justify-center mt-6">
        <Link
          href="/news"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          {language === "ar" ? "عرض جميع الأخبار" : "View All News"}
        </Link>
      </div>
    </div>
  )
}

// CATEGORY NEWS CONTENT - Shows preview and "View All [Category] News" button
function CategoryNewsContent({
  categoryId,
  categoryName,
  categoryNameEn,
}: {
  categoryId: string
  categoryName: string
  categoryNameEn: string
}) {
  const { language } = useLanguage()
  const { news, loading } = useNewsByCategory(categoryId, 1, 6)

  // ALWAYS use English name for URL generation (regardless of current language)
  const getCategoryUrl = (catId: string, catNameEn: string) => {
    // First try predefined mapping
    if (categoryUrlMap[catId]) {
      return categoryUrlMap[catId]
    }
    // Always use English name for URL slug
    return slugify(catNameEn)
  }

  const categoryUrl = getCategoryUrl(categoryId, categoryNameEn)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[300px] animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item, idx) => (
        <NewsCard key={item.id} item={item} index={idx} />
      ))}
      <div className="col-span-full flex justify-center mt-6">
        <Link
          href={`/news/category/${categoryUrl}`}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          {language === "ar" ? `عرض جميع أخبار ${categoryName}` : `View All ${categoryName} News`}
        </Link>
      </div>
    </div>
  )
}

interface NewsCardProps {
  item: any
  index: number
}
function NewsCard({ item, index }: NewsCardProps) {
  const { language, isRtl } = useLanguage()

  // Get title for display based on current language
  const displayTitle = language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""

  // ONLY GET SUMMARY - NO FALLBACK TO CONTENT!
  const newsSummary = language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = item.titleEn || item.title || ""
  const slug = slugify(englishTitle)

  console.log(`News card linking to /news/${slug} (ID: ${item.id})`)

  // Don't render if no title
  if (!displayTitle) {
    return null
  }

  // Clean HTML tags and check for valid summary
  const cleanSummary = newsSummary.replace(/<\/?[^>]+(>|$)/g, "").trim()
  const hasValidSummary = cleanSummary && cleanSummary !== "string" && cleanSummary.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/news/${slug}`} className="group">
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
          <div className="relative h-48">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}
            >
              {new Date(item.date || item.createdAt).toLocaleDateString("en-US")}
            </div>
          </div>

          <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>
            {/* ALWAYS show summary area - empty string if no summary */}
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

interface ArticleCardProps {
  item: any
  index: number
}
function ArticleCard({ item, index }: ArticleCardProps) {
  const { language, isRtl } = useLanguage()

  // Get title for display based on current language
  const displayTitle = language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""

  // Get summary for display
  const displaySummary = language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""

  // ALWAYS use English title for URL slug (regardless of current language)
  const englishTitle = item.titleEn || item.title || ""
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
              src={item.imageUrl || "/placeholder.svg"}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}
            >
              {new Date(item.createdAt).toLocaleDateString("en-US")}
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

function CurrentYearAwarenessContent() {
  const { language, isRtl } = useLanguage()
  const { data, loading, error } = useCurrentYearAwareness("", 1, 3) // Only get first 3 items

  const getDisplayTitle = (item: any) => {
    return language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""
  }

  const getDisplaySummary = (item: any) => {
    return language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""
  }

  const getSlug = (item: any) => {
    const englishTitle = item.titleEn || item.title || ""
    return slugify(englishTitle)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[250px] animate-pulse dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{language === "ar" ? "خطأ في تحميل البيانات" : "Error loading data"}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.data.length > 0 ? (
          data.data.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/awareness/${item.year}/${getSlug(item)}`} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-primary/50">
                  <CardContent className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
                    {/* Header with icon and badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 dark:bg-primary/5 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <Badge className="bg-primary/10 dark:bg-primary/5 text-primary border-primary/20 dark:border-primary/10">
                          {item.year}
                        </Badge>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors dark:text-slate-200">
                      {getDisplayTitle(item)}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-muted-foreground dark:text-slate-400 mb-4 line-clamp-3">
                      {getDisplaySummary(item)}
                    </p>

                    {/* Read more link */}
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
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">{language === "ar" ? "لا توجد بيانات" : "No data available"}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {data && data.data.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href={`/awareness/${new Date().getFullYear()}`}>
            <Button className="flex items-center gap-2">
              {language === "ar" ? "المزيد من هذا العام" : "More This Year"}
              <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
            </Button>
          </Link>
          <Link href="/awareness/years">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {language === "ar" ? "جميع السنوات" : "All Years"}
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
