"use client"

import { use } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Share2,
  BookOpen,
  Lightbulb,
  FileText,
  TrendingUp
} from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { container } from "@/core/di/container"
import { purifyContent, extractTextContent, formatDateArabicNumbers, formatDate } from "@/lib/content-purifier"
import { useState, useEffect } from "react"

interface AwarenessArticlePageProps {
  params: Promise<{
    year: string
    id: string
  }>
}

export default function AwarenessArticlePage({ params }: AwarenessArticlePageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const [awareness, setAwareness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAwareness = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await container.services.awareness.getAwarenessById(resolvedParams.id)
        setAwareness(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setAwareness(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAwareness()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
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

  if (error || !awareness) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "نشرات التوعية" : "Awareness Materials" },
              { label: language === "ar" ? "جميع السنوات" : "All Years", href: "/simple/awareness/years" },
              { label: `${resolvedParams.year}`, href: `/simple/awareness/year/${resolvedParams.year}` },
              { label: language === "ar" ? "النشرة" : "Article" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل النشرة" : "Error Loading Article"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل نشرة التوعية. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading the awareness article. Please try again."
              }
            </p>
            <Link 
              href={`/simple/awareness/year/${resolvedParams.year}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {language === "ar" ? "العودة إلى السنة" : "Back to Year"}
                </>
              ) : (
                <>
                  {language === 'ar' ? "العودة إلى السنة" : "Back to Year"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const purifiedContent = purifyContent(awareness.content)
  const displayTitle = language === "ar" ? awareness.title : (awareness.titleEn || awareness.title)
  const displaySummary = language === "ar" ? awareness.summary : (awareness.summaryEn || awareness.summary)
  const formattedDate = language === "ar" ? formatDateArabicNumbers(awareness.createdAt) : formatDate(awareness.createdAt)

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
            { label: language === "ar" ? "نشرات التوعية" : "Awareness Materials" },
            { label: language === "ar" ? "جميع السنوات" : "All Years", href: "/simple/awareness/years" },
            { label: `${resolvedParams.year}`, href: `/simple/awareness/year/${resolvedParams.year}` },
            { label: language === "ar" ? "النشرة" : "Article" }
          ]} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <article className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700">
              {/* Article Header */}
              <div className="p-8 lg:p-10">
                {/* Category Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30 rounded-full border border-teal-200 dark:border-teal-800">
                    <span className="text-sm font-semibold text-teal-800 dark:text-teal-200">
                      {language === "ar" ? "نشرة توعية" : "Awareness Material"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                  {displayTitle}
                </h1>
                {displaySummary && (
                  <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {displaySummary}
                  </div>
                )}
              </div>

              {/* Meta Information */}
              <div className="px-8 lg:px-10 pb-6">
                <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
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

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "السنة" : "Year"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {awareness.year}
                      </p>
                    </div>
                  </div>

                  {/* Document Link */}
                  {awareness.documentUrl && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {language === "ar" ? "المستند" : "Document"}
                        </p>
                        <a 
                          href={awareness.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-300"
                        >
                          {language === "ar" ? "تحميل المستند" : "Download Document"}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="px-8 lg:px-10 pb-8">
                <div 
                  className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50 dark:prose-blockquote:bg-teal-900/20 prose-blockquote:rounded-xl prose-blockquote:p-6"
                  dangerouslySetInnerHTML={{ __html: purifiedContent }}
                />
              </div>

              {/* Share Section */}
              <div className="px-8 lg:px-10 pb-8">
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                        <Share2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {language === "ar" ? "شارك هذه النشرة" : "Share This Article"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {language === "ar" ? "ساعد الآخرين في العثور على هذا المحتوى" : "Help others find this content"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigator.share?.({ title: displayTitle, url: window.location.href })}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:from-teal-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>{language === "ar" ? "مشاركة" : "Share"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-10">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "إحصائيات سريعة" : "Quick Statistics"}
                </h2>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{language === "ar" ? "عدد الكلمات" : "Word Count"}:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{extractTextContent(awareness.content).split(' ').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{language === "ar" ? "تاريخ النشر" : "Published Date"}:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{language === "ar" ? "السنة" : "Year"}:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{awareness.year}</span>
                </div>
                {awareness.documentUrl && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{language === "ar" ? "المستند" : "Document"}:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {language === "ar" ? "متوفر" : "Available"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Year Navigation */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "نشرات السنة" : "Year Materials"}
                </h2>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href={`/simple/awareness/year/${resolvedParams.year}`}
                  className="block p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                      {language === "ar" ? "جميع نشرات السنة" : "All Year Materials"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                    )}
                  </div>
                </Link>
                
                <Link 
                  href="/simple/awareness/years"
                  className="block p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                      {language === "ar" ? "جميع السنوات" : "All Years"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}