"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { News, NewsCategory } from "@/core/domain/models/news"
import { Newspaper, Calendar, TrendingUp, Folder } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

interface CategoryPageProps {
      params: Promise<{
            categoryId: string
      }>
}

export default function CategoryNewsPage({ params }: CategoryPageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [category, setCategory] = useState<NewsCategory | null>(null)
      const [news, setNews] = useState<News[]>([])
      const [loading, setLoading] = useState(true)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch category details
                        const categoriesResponse = await container.services.news.getNewsCategories(1, 100)
                        const foundCategory = categoriesResponse.data.find((cat: NewsCategory) => cat.id === resolvedParams.categoryId)
                        setCategory(foundCategory || null)

                        // Fetch news for this category
                        const newsData = await container.services.news.getNewsByCategoryForProfessionals(resolvedParams.categoryId, 1, 100)
                        setNews(newsData)
                  } catch (error) {
                        console.error("❌ Error fetching category news:", error)
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.categoryId])

      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "الأخبار" : "News", href: "/advanced/news" },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs: Home > News > [Category] */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "الأخبار" : "News", href: "/advanced/news" },
                              { label: categoryName || (language === "ar" ? "فئة الأخبار" : "Category") }
                        ]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              {/* <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
                                    <Folder className="h-8 w-8 text-white" />
                              </div> */}

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {categoryName}
                              </h1>

                              <p className="text-lg text-gray-600 dark:text-gray-300">
                                    {language === "ar"
                                          ? `تصفح آخر الأخبار في فئة ${categoryName}`
                                          : `Browse latest news in ${categoryName} category`}
                              </p>

                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                          {language === "ar" ? `${news.length} خبر متاح` : `${news.length} articles available`}
                                    </span>
                              </div>
                        </div>

                        {/* News Grid */}
                        {news.length === 0 ? (
                              <div className="text-center py-16">
                                    <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {language === "ar" ? "لا توجد أخبار في هذه الفئة" : "No news in this category"}
                                    </p>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {news.map((item) => (
                                          <NewsCard key={item.id} item={item} categoryId={resolvedParams.categoryId} language={language} isRtl={isRtl} />
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      )
}

function NewsCard({ item, categoryId, language, isRtl }: { item: News; categoryId: string; language: string; isRtl: boolean }) {
      const title = language === "ar" ? item.title : (item.titleEn || item.title)
      const summary = language === "ar" ? item.summary : (item.summaryEn || item.summary)
      const date = new Date(item.date || Date.now())

      if (!title) return null

      const cleanSummary = (summary || "").replace(/<\/?[^>]+(>|$)/g, "").trim()

      return (
            <Link href={`/advanced/news/${categoryId}/${item.id}`} className="group">
                  <article className="h-full bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                              {item.imageUrl ? (
                                    <Image
                                          src={item.imageUrl}
                                          alt={title}
                                          fill
                                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                              ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                          <Newspaper className="h-16 w-16 text-white/30" />
                                    </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                              {/* Date Badge */}
                              <div className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center gap-2`}>
                                    <Calendar className="h-3 w-3 text-blue-600" />
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                          {date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}
                                    </span>
                              </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {title}
                              </h3>

                              {cleanSummary && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                          {cleanSummary}
                                    </p>
                              )}

                              {/* Read More */}
                              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                                    <span>{language === "ar" ? "اقرأ المزيد" : "Read more"}</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                    </svg>
                              </div>
                        </div>
                  </article>
            </Link>
      )
}
