"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { NewsCategory } from "@/core/domain/models/news"
import { Newspaper, Folder, TrendingUp, Sparkles, Search } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"

export default function NewsPage() {
      const { language, isRtl } = useLanguage()
      const [categories, setCategories] = useState<NewsCategory[]>([])
      const [loading, setLoading] = useState(true)
      const [searchQuery, setSearchQuery] = useState("")

      useEffect(() => {
            const fetchCategories = async () => {
                  try {
                        setLoading(true)
                        const response = await container.services.news.getNewsCategories(1, 100)
                        setCategories(response.data || [])
                  } catch (error) {
                        console.error("❌ Error fetching news categories:", error)
                        setCategories([])
                  } finally {
                        setLoading(false)
                  }
            }
            fetchCategories()
      }, [])

      const filteredCategories = categories.filter(cat => {
            const name = language === "ar" ? cat.name : (cat.nameEn || cat.name)
            return name.toLowerCase().includes(searchQuery.toLowerCase())
      })

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[{ label: language === "ar" ? "الأخبار" : "News" }]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-72 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
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
                        {/* Breadcrumbs: Home > News */}
                        <AdvancedBreadcrumbs items={[{ label: language === "ar" ? "الأخبار" : "News" }]} />

                        {/* Header */}
                        <div className="mb-10 mt-6">
                              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
                                    <TrendingUp className="h-8 w-8 text-white" />
                              </div>

                              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    {language === "ar" ? "فئات الأخبار" : "News Categories"}
                              </h1>

                              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                                    {language === "ar"
                                          ? "تصفح أحدث الأخبار والمستجدات في مجال الأمن السيبراني"
                                          : "Browse latest news and updates in cybersecurity"}
                              </p>

                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                          {language === "ar" ? `${categories.length} فئة متاحة` : `${categories.length} categories available`}
                                    </span>
                              </div>
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                              <div className="relative max-w-md">
                                    <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                          type="text"
                                          value={searchQuery}
                                          onChange={(e) => setSearchQuery(e.target.value)}
                                          placeholder={language === "ar" ? "ابحث في الفئات..." : "Search categories..."}
                                          className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                              </div>
                        </div>

                        {/* Categories Grid */}
                        {filteredCategories.length === 0 ? (
                              <div className="text-center py-16">
                                    {/* <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" /> */}
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {searchQuery
                                                ? (language === "ar" ? "لا توجد نتائج للبحث" : "No search results")
                                                : (language === "ar" ? "لا توجد فئات أخبار متاحة" : "No news categories available")
                                          }
                                    </p>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredCategories.map((category) => (
                                          <CategoryCard key={category.id} category={category} language={language} isRtl={isRtl} />
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      )
}

function CategoryCard({ category, language, isRtl }: { category: NewsCategory; language: string; isRtl: boolean }) {
      const name = language === "ar" ? category.name : (category.nameEn || category.name)

      return (
            <Link href={`/advanced/news/${category.id}`} className="group">
                  <article className="h-full bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                              {category.imageUrl ? (
                                    <Image
                                          src={category.imageUrl}
                                          alt={name}
                                          fill
                                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                              ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                          <Folder className="h-16 w-16 text-white/30" />
                                    </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                              {/* Badge */}
                              <div className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full`}>
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                          {language === "ar" ? "فئة أخبار" : "News Category"}
                                    </span>
                              </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {name}
                              </h3>

                              {/* Browse Button */}
                              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
                                    <span>{language === "ar" ? "تصفح الأخبار" : "Browse News"}</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                    </svg>
                              </div>
                        </div>
                  </article>
            </Link>
      )
}
