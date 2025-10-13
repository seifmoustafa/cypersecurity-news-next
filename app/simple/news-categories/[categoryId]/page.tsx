"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Newspaper, Calendar, ArrowRight, ArrowLeft, Star, BookOpen, Search } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useNews } from "@/core/hooks/use-news"
import { useNewsCategories } from "@/core/hooks/use-news-categories"
import { useDebounce } from "@/hooks/use-debounce"
import { use } from "react"

interface NewsCategoryPageProps {
  params: Promise<{
    categoryId: string
  }>
}

export default function NewsCategoryPage({ params }: NewsCategoryPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const { news, loading, error } = useNews(resolvedParams.categoryId, 1, 100, debouncedQuery)
  const { categories } = useNewsCategories(1, 100)
  
  // Find the current category
  const currentCategory = categories.find(cat => cat.id === resolvedParams.categoryId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        {/* Cybersecurity Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "فئات الأخبار" : "News Categories", href: "/simple/news-categories" },
              { label: currentCategory ? (language === "ar" ? currentCategory.name : (currentCategory.nameEn || currentCategory.name)) : (language === "ar" ? "جاري التحميل..." : "Loading...") }
            ]} 
          />

          {/* Search Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === "ar" ? "ابحث في أخبار هذه الفئة..." : "Search news in this category..."}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-80 animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-3xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل الأخبار" : "Error Loading News"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل أخبار هذه الفئة. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading news for this category. Please try again."
              }
            </p>
            <Link 
              href="/simple/news-categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {language === "ar" ? "العودة إلى فئات الأخبار" : "Back to News Categories"}
                </>
              ) : (
                <>
                  {language === "ar" ? "العودة إلى فئات الأخبار" : "Back to News Categories"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "فئات الأخبار" : "News Categories", href: "/simple/news-categories" },
              { label: currentCategory ? (language === "ar" ? currentCategory.name : (currentCategory.nameEn || currentCategory.name)) : (language === "ar" ? "أخبار الفئة" : "Category News") }
            ]} 
          />

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "ar" ? "ابحث في أخبار هذه الفئة..." : "Search news in this category..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "لا توجد أخبار" : "No News Found"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {language === "ar" 
                ? "لم يتم العثور على أخبار في هذه الفئة."
                : "No news articles found in this category."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((newsItem, index) => (
              <Link
                key={newsItem.id}
                href={`/simple/news-categories/${resolvedParams.categoryId}/${newsItem.id}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden rounded-t-3xl">
                    {newsItem.imageUrl ? (
                      <img
                        src={newsItem.imageUrl}
                        alt={language === "ar" ? newsItem.title : (newsItem.titleEn || newsItem.title)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 flex items-center justify-center">
                        <Newspaper className="h-16 w-16 text-teal-600 dark:text-teal-400" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                        <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {language === "ar" ? "خبر" : "News"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 line-clamp-2">
                      {language === "ar" ? newsItem.title : (newsItem.titleEn || newsItem.title)}
                    </h3>

                    {/* Summary */}
                    {newsItem.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {language === "ar" ? newsItem.summary : (newsItem.summaryEn || newsItem.summary)}
                      </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {language === "ar" 
                            ? new Date(newsItem.date).toLocaleDateString('ar-US')
                            : new Date(newsItem.date).toLocaleDateString('en-US')
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">
                        <span className="text-sm font-medium">
                          {language === "ar" ? "اقرأ المزيد" : "Read More"}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                        ) : (
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
