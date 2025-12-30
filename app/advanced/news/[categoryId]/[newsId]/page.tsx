"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { News, NewsCategory } from "@/core/domain/models/news"
import { Calendar, Tag, Share2, Eye, TrendingUp, Newspaper } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

interface NewsDetailPageProps {
      params: Promise<{
            categoryId: string
            newsId: string
      }>
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [news, setNews] = useState<News | null>(null)
      const [category, setCategory] = useState<NewsCategory | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch news article
                        const newsData = await container.services.news.getNewsById(resolvedParams.newsId)
                        setNews(newsData)

                        // Fetch category for breadcrumbs
                        const categoriesResponse = await container.services.news.getNewsCategories(1, 100)
                        const foundCategory = categoriesResponse.data.find((cat: NewsCategory) => cat.id === resolvedParams.categoryId)
                        setCategory(foundCategory || null)
                  } catch (err) {
                        console.error("❌ Error fetching news:", err)
                        setError(language === "ar" ? "حدث خطأ في تحميل الخبر" : "Error loading news")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.newsId, resolvedParams.categoryId, language])

      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "الأخبار" : "News", href: "/advanced/news" },
                                    { label: "..." },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-3xl"></div>
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="space-y-4">
                                          {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      if (error || !news) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "الأخبار" : "News", href: "/advanced/news" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />

                              <div className="max-w-4xl mx-auto text-center py-16">
                                    <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                          <Newspaper className="h-12 w-12 text-red-500" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                          {language === "ar" ? "الخبر غير موجود" : "News Not Found"}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                          {error || (language === "ar" ? "عذراً، الخبر المطلوب غير متاح" : "Sorry, the requested news article is not available")}
                                    </p>
                              </div>
                        </div>
                  </div>
            )
      }

      const title = language === "ar" ? news.title : (news.titleEn || news.title)
      const content = language === "ar" ? news.content : (news.contentEn || news.content)
      const summary = language === "ar" ? news.summary : (news.summaryEn || news.summary)
      const date = new Date(news.date || Date.now())

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs: Home > News > [Category] > [Article] */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "الأخبار" : "News", href: "/advanced/news" },
                              { label: categoryName, href: `/advanced/news/${resolvedParams.categoryId}` },
                              { label: title || "" }
                        ]} />

                        {/* Article Container */}
                        <article className="max-w-5xl mx-auto mt-6">
                              <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700 overflow-hidden shadow-2xl">
                                    {/* Featured Image */}
                                    {news.imageUrl && (
                                          <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                                                <Image
                                                      src={news.imageUrl}
                                                      alt={title || ""}
                                                      fill
                                                      className="object-cover"
                                                      priority
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                                {/* Floating Stats */}
                                                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 flex-wrap">
                                                      <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full">
                                                            <Calendar className="h-4 w-4 text-blue-600" />
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                  {date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric"
                                                                  })}
                                                            </span>
                                                      </div>

                                                      {categoryName && (
                                                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/90 backdrop-blur-sm rounded-full">
                                                                  <Tag className="h-4 w-4 text-white" />
                                                                  <span className="text-sm font-medium text-white">
                                                                        {categoryName}
                                                                  </span>
                                                            </div>
                                                      )}
                                                </div>
                                          </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-8 md:p-12">
                                          {/* Title */}
                                          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                                                {title}
                                          </h1>

                                          {/* Summary */}
                                          {summary && (
                                                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-l-4 border-blue-600 p-6 mb-10 rounded-r-2xl">
                                                      <div className="flex items-start gap-3">
                                                            <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                                            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                                                                  {summary.replace(/<[^>]*>/g, '')}
                                                            </p>
                                                      </div>
                                                </div>
                                          )}

                                          {/* Article Content */}
                                          <div
                                                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-gray-900 dark:prose-headings:text-white 
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                  prose-ol:text-gray-700 dark:prose-ol:text-gray-300"
                                                dangerouslySetInnerHTML={{ __html: content || "" }}
                                          />

                                          {/* Share Section */}
                                          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <Eye className="h-5 w-5" />
                                                            <span className="text-sm">
                                                                  {language === "ar" ? "شارك هذا الخبر مع الآخرين" : "Share this article with others"}
                                                            </span>
                                                      </div>

                                                      <button
                                                            onClick={() => {
                                                                  if (navigator.share) {
                                                                        navigator.share({
                                                                              title: title || "",
                                                                              text: summary?.replace(/<[^>]*>/g, '') || "",
                                                                              url: window.location.href
                                                                        })
                                                                  }
                                                            }}
                                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                                                      >
                                                            <Share2 className="h-4 w-4" />
                                                            {language === "ar" ? "مشاركة" : "Share"}
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </article>
                  </div>
            </div>
      )
}
