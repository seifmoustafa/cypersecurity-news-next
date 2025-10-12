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
import { useNewsCategories } from "@/core/hooks/use-news-categories"
import { useNewsByCategory } from "@/core/hooks/use-news-by-category"
import { useNewsByCategoryForProfessionals } from "@/core/hooks/use-news-by-category-for-professionals"
import { useLatestArticles } from "@/core/hooks/use-articles"
import { container } from "@/core/di/container"
import { getLocalizedText } from "@/lib/utils"
import { useCurrentYearAwareness } from "@/core/hooks/use-awareness"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, FileText, AlertTriangle, BookOpen, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AwarenessSection() {
  const { t, language, isRtl } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("news")
  const [activeNewsCategory, setActiveNewsCategory] = useState("")

  // Fetch real articles from API
  const { articles, loading: articlesLoading } = useLatestArticles(3)

  // Fetch categories from API
  const { categories, loading: categoriesLoading } = useNewsCategories(1, 100)

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

  // Set the first category as default when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeNewsCategory) {
      setActiveNewsCategory(categories[0].id)
    }
  }, [categories, activeNewsCategory])

  // Listen for external tab-change events
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const { sectionId, tab } = (e as CustomEvent).detail || {}
      if (sectionId === "awareness" && tab) {
        setActiveTab(tab)
        if (tab === "news" && categories.length > 0) {
          setActiveNewsCategory(categories[0].id)
        }
      }
    }
    window.addEventListener("tabchange", handleTabChange)
    return () => window.removeEventListener("tabchange", handleTabChange)
  }, [categories])

  return (
    <SectionContainer id="awareness" className="bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 dark:from-blue-950/30 dark:via-slate-900 dark:to-cyan-950/20">
      <SectionHeader title={t("section.awareness")} subtitle={t("awareness.subtitle")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full max-w-lg mx-auto mb-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
          <TabsTrigger value="news" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {language === "ar" ? "الأخبار" : "News"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="bulletins" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("awareness.bulletins")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex-1 font-semibold transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t("awareness.articles")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <Tabs value={activeNewsCategory} onValueChange={setActiveNewsCategory} className="w-full mb-8">
            <TabsList
              className={`w-full max-w-5xl mx-auto mb-12 flex flex-wrap justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 shadow-md shadow-blue-500/10 dark:shadow-blue-500/20 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {!categoriesLoading && categories.length > 0 ? (
                categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id} className="flex-grow font-medium transition-all duration-300 hover:scale-105">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {language === "ar" ? cat.name || cat.nameEn : cat.nameEn || cat.name}
                    </span>
                  </TabsTrigger>
                ))
              ) : (
                <div className="text-muted-foreground py-4">
                  {language === "ar" ? "لا توجد فئات متاحة" : "No categories available"}
                </div>
              )}
            </TabsList>

            {!categoriesLoading && categories.length > 0 ? (
              categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id}>
                  <CategoryNewsContent
                    categoryId={cat.id}
                    categoryName={language === "ar" ? (cat.name || cat.nameEn || "") : (cat.nameEn || cat.name || "")}
                    categoryNameEn={cat.nameEn || cat.name || ""}
                  />
                </TabsContent>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {language === "ar" ? "لا توجد فئات أخبار متاحة" : "No news categories available"}
                </p>
              </div>
            )}
          </Tabs>
        </TabsContent>

        <TabsContent value="bulletins">
          <CurrentYearAwarenessContent />
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
            {articlesLoading ? (
              // Loading skeleton
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="h-[300px] animate-pulse">
                    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
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
          </div>
          {/* View All Articles Button */}
          {articles.length > 0 && !articlesLoading && (
            <div className="mt-8 text-center">
              <Link href="/advanced/articles">
                <Button variant="outline">{language === "ar" ? "عرض جميع المقالات" : "View All Articles"}</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </SectionContainer>
  )
}

// ALL NEWS CONTENT - Shows preview and "View All News" button
function AllNewsContent() {
  const { language, isRtl } = useLanguage()
  const [allNews, setAllNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Get first 6 news items for preview using the professionals endpoint
        const data = await container.services.news.getNewsByCategoryForProfessionals("3d25ba9f-3a6f-4c04-bfb0-488cc22822ed", 1, 6)
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
        {loading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="h-[300px] animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))
          : allNews.map((item, idx) => <NewsCard key={item.id} item={item} index={idx} />)}
      </div>
      {allNews.length > 0 && !loading && (
        <div className="mt-8 text-center">
          <Link href="/advanced/news">
            <Button variant="outline">{language === "ar" ? "عرض جميع الأخبار" : "View All News"}</Button>
          </Link>
        </div>
      )}
    </>
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
  const { language, isRtl } = useLanguage()
  const { news, loading } = useNewsByCategoryForProfessionals(categoryId, 1, 6)

  // Use the category ID directly for URL generation
  const categoryUrl = categoryId

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
        {loading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="h-[300px] animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))
          : news.map((item, idx) => <NewsCard key={item.id} item={item} index={idx} />)}
      </div>
      {news.length > 0 && !loading && (
        <div className="mt-8 text-center">
          <Link href={`/advanced/news/category/${categoryUrl}`}>
            <Button variant="outline">{language === "ar" ? `عرض جميع أخبار ${categoryName}` : `View All ${categoryName} News`}</Button>
          </Link>
        </div>
      )}
    </>
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

  // Use ID for URL
  console.log(`News card linking to /advanced/news/${item.id}`)

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
      whileHover={{ y: -5 }}
    >
      <Link href={`/advanced/news/${item.id}`} className="group">
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 hover:border-primary/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30">
          <div className="relative h-48">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div
              className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-blue-600/95 dark:bg-blue-700/95 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-blue-500/30 dark:border-blue-400/30 shadow-lg`}
            >
              {new Date(item.date || item.createdAt).toLocaleDateString("en-US")}
            </div>
          </div>

          <CardContent className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {displayTitle}
            </h3>
            {/* ALWAYS show summary area - empty string if no summary */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{hasValidSummary ? cleanSummary : ""}</p>
            <div className="mt-auto inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all duration-300">
              {language === "ar" ? "اقرأ المزيد" : "Read More"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? "mr-2 rotate-180" : "ml-2"}`}
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
      whileHover={{ y: -5 }}
    >
      <Link href={`/advanced/articles/${item.id}`} className="group">
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 dark:hover:shadow-green-500/30 hover:border-primary/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-200/30 dark:border-green-800/30">
          <div className="relative h-48">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div
              className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-green-600/95 dark:bg-green-700/95 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-green-500/30 dark:border-green-400/30 shadow-lg`}
            >
              {new Date(item.createdAt).toLocaleDateString("en-US")}
            </div>
          </div>

          <CardContent className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {displayTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{hasValidSummary ? cleanSummary : ""}</p>
            <div className="mt-auto inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all duration-300">
              {language === "ar" ? "اقرأ المزيد" : "Read More"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? "mr-2 rotate-180" : "ml-2"}`}
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
  const { data, loading, error } = useCurrentYearAwareness("", 1, 100)

  const getDisplayTitle = (item: any) => {
    return language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""
  }

  const getDisplaySummary = (item: any) => {
    return language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={isRtl ? { direction: 'rtl' } : {}}>
        {data && data.data.length > 0 ? (
          data.data.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/advanced/awareness/${item.year}/${item.id}`} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 dark:hover:shadow-orange-500/30 hover:border-primary/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-orange-200/30 dark:border-orange-800/30">
                  <CardContent className={`p-6 ${isRtl ? "text-right" : "text-left"}`}>
                    {/* Enhanced Header with icon and badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/20 dark:bg-orange-500/10 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10">
                          <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <Badge className="bg-orange-500/20 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30 dark:border-orange-500/20 px-3 py-1 font-semibold shadow-sm">
                          {item.year}
                        </Badge>
                      </div>
                    </div>

                    {/* Enhanced Title */}
                    <h3 className="text-lg font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300 dark:text-slate-200">
                      {getDisplayTitle(item)}
                    </h3>

                    {/* Enhanced Summary */}
                    <p className="text-sm text-muted-foreground dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                      {getDisplaySummary(item)}
                    </p>

                    {/* Enhanced Read more link */}
                    <div className="mt-auto inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all duration-300">
                      {language === "ar" ? "اقرأ المزيد" : "Read More"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? "mr-2 rotate-180" : "ml-2"}`}
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

      {/* Enhanced Action Buttons */}
      {data && data.data.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <Link href={`/advanced/awareness/${new Date().getFullYear()}`}>
            <Button className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-orange-500/30 dark:shadow-orange-500/40 border border-orange-500/30 dark:border-orange-400/30">
              {language === "ar" ? "المزيد من هذا العام" : "More This Year"}
              <ArrowRight className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? "rotate-180" : ""}`} />
            </Button>
          </Link>
          <Link href="/advanced/awareness/years">
            <Button variant="outline" className="flex items-center gap-3 border-orange-500/30 dark:border-orange-400/30 text-orange-700 dark:text-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/20 dark:shadow-orange-500/30">
              <Calendar className="h-5 w-5" />
              {language === "ar" ? "جميع السنوات" : "All Years"}
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
