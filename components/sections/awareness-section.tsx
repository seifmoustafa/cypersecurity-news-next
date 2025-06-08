"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useNewsByCategory, useNewsCategories } from "@/core/hooks/use-news"
import { container } from "@/core/di/container"
import { awarenessData } from "@/data/awareness-data"
import { slugify } from "@/lib/utils"
import type { NewsCategory } from "@/core/domain/models/news-category"

export default function AwarenessSection() {
  const { t, language, isRtl } = useLanguage()
  const [bulletins, setBulletins] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("news")
  const [activeNewsCategory, setActiveNewsCategory] = useState("all")

  // Fetch categories from API
  const { categories, loading: categoriesLoading } = useNewsCategories()

  useEffect(() => {
    const fetchAwarenessData = async () => {
      try {
        setLoading(true)
        // Using static data until API is provided
        setBulletins(awarenessData.bulletins)
        setArticles(awarenessData.articles)
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
            <TabsList className={`w-full max-w-4xl mx-auto mb-8 flex flex-wrap justify-center ${isRtl ? "flex-row-reverse" : ""}`}>
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
                />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="bulletins">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bulletins.map((item, idx) => (
              <AwarenessCard key={item.id} item={item} index={idx} />
            ))}
            {!loading && bulletins.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">{t("common.noData")}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item, idx) => (
              <AwarenessCard key={item.id} item={item} index={idx} />
            ))}
            {!loading && articles.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">{t("common.noData")}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  )
}

function AllNewsContent() {
  const { language } = useLanguage()
  const [allNews, setAllNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await container.services.news.getNewsByCategory(null, 1, 6)
      setAllNews(data)
      setLoading(false)
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
        <Link href="/news" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md">
          {language === "ar" ? "عرض جميع الأخبار" : "View All News"}
        </Link>
      </div>
    </div>
  )
}

function CategoryNewsContent({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const { language } = useLanguage()
  const { news, loading } = useNewsByCategory(categoryId, 1, 6)

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
          href={`/news/category/${categoryId}`}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
        >
          {language === "ar"
            ? `عرض جميع أخبار ${categoryName}`
            : `View All ${categoryName} News`}
        </Link>
      </div>
    </div>
  )
}

interface AwarenessCardProps {
  item: any
  index: number
}
function AwarenessCard({ item, index }: AwarenessCardProps) {
  const { language, isRtl } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/awareness/${item.id}`}>
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer">
          <div className="relative h-48">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title[language]}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}>
              {new Date(item.date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
            </div>
          </div>
          <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title[language]}</h3>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {item.summary[language]}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

interface NewsCardProps {
  item: any
  index: number
}
function NewsCard({ item, index }: NewsCardProps) {
  const { language, isRtl } = useLanguage()

  const getTitle = (i: any) =>
    language === "ar"
      ? i.title || i.titleEn || "No title"
      : i.titleEn || i.title || "No title"
  const getContent = (i: any) =>
    language === "ar"
      ? i.summary || i.summaryEn || i.content || i.contentEn || ""
      : i.summaryEn || i.summary || i.contentEn || i.content || ""

  const newsTitle = getTitle(item)
  const newsSummary = getContent(item)
  const slug = slugify(newsTitle)

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
              alt={newsTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}
            >
              {new Date(item.date || item.createdAt).toLocaleDateString(
                language === "ar" ? "ar-SA" : "en-US"
              )}
            </div>
          </div>

          <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {newsTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {newsSummary}
            </p>
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
