"use client"

import { use } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { 
  Newspaper, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Share2,
  BookOpen,
  Eye,
  TrendingUp
} from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useNewsItem } from "@/core/hooks/use-news-item"
import { useNews } from "@/core/hooks/use-news"
import { purifyContent, extractTextContent, formatDate, formatDateArabicNumbers } from "@/lib/content-purifier"

interface NewsDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const { news, loading, error } = useNewsItem(resolvedParams.id)
  
  // Fetch related news from the same category (excluding current news)
  const { news: relatedNews } = useNews(news?.categoryId || null, 1, 5)
  const filteredRelatedNews = relatedNews.filter(item => item.id !== resolvedParams.id).slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-8">
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-8 animate-pulse"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8 w-3/4 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "فئات الأخبار" : "News Categories", href: "/simple/news-categories" },
              { label: language === "ar" ? "الأخبار" : "News" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل الخبر" : "Error Loading News"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل الخبر. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading the news. Please try again."
              }
            </p>
            <Link 
              href="/simple/news-categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
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

  const purifiedContent = purifyContent(news.content)
  const displayTitle = language === "ar" ? news.title : (news.titleEn || news.title)
  const displaySummary = language === "ar" ? news.summary : (news.summaryEn || news.summary)
  const formattedDate = language === "ar" ? formatDateArabicNumbers(news.date) : formatDate(news.date)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
            { label: language === "ar" ? "فئات الأخبار" : "News Categories", href: "/simple/news-categories" },
            { label: language === "ar" ? "الأخبار" : "News" }
          ]} 
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              {news.imageUrl && (
                <div className="relative group">
                  <div className="relative h-96 overflow-hidden rounded-3xl shadow-2xl">
                    <img 
                      src={news.imageUrl} 
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Floating Category Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {language === "ar" ? "خبر" : "News"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Article Header */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {displayTitle}
                  </h1>
                  
                  {displaySummary && (
                    <div className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl border-l-4 border-indigo-500">
                      {displaySummary}
                    </div>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "تاريخ النشر" : "Published"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-900/20 prose-blockquote:rounded-xl prose-blockquote:p-6"
                dangerouslySetInnerHTML={{ __html: purifiedContent }}
              />

              {/* Tags Section */}
              {news.tags && news.tags.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center">
                      <Tag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {language === "ar" ? "العلامات" : "Tags"}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {news.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-800 dark:text-orange-200 text-sm font-medium rounded-full border border-orange-200 dark:border-orange-800 hover:from-orange-200 hover:to-red-200 dark:hover:from-orange-800/50 dark:hover:to-red-800/50 transition-all duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                      <Share2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "شارك هذا الخبر" : "Share this news"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === "ar" ? "ساعد الآخرين في العثور على هذا المحتوى" : "Help others discover this content"}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigator.share?.({ title: displayTitle, url: window.location.href })}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>{language === "ar" ? "مشاركة" : "Share"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related Articles */}
              {filteredRelatedNews.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {language === "ar" ? "أخبار ذات صلة" : "Related News"}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredRelatedNews.map((relatedItem, index) => {
                      const relatedTitle = language === "ar" ? relatedItem.title : (relatedItem.titleEn || relatedItem.title)
                      const relatedDate = language === "ar" ? formatDateArabicNumbers(relatedItem.date) : formatDate(relatedItem.date)
                      
                      return (
                        <Link
                          key={relatedItem.id}
                          href={`/simple/news/${relatedItem.id}`}
                          className="group block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-600"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                              {relatedTitle}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{relatedDate}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
                                {language === "ar" ? "اقرأ المزيد" : "Read More"}
                              </span>
                              {isRtl ? (
                                <ArrowLeft className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:-translate-x-1 transition-transform duration-300" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300" />
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {language === "ar" ? "إحصائيات سريعة" : "Quick Stats"}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "عدد الكلمات" : "Word Count"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {extractTextContent(news.content).split(' ').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "تاريخ النشر" : "Published"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formattedDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "الفئة" : "Category"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {language === "ar" ? "الأخبار" : "News"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}