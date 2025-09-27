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
  FileText
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-8">
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="max-w-4xl mx-auto">
            {/* Title Skeleton */}
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8 w-3/4 animate-pulse"></div>
            
            {/* Meta Skeleton */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !awareness) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "مواد التوعية" : "Awareness Materials" },
              { label: language === "ar" ? "جميع السنوات" : "All Years", href: "/simple/awareness/years" },
              { label: `${resolvedParams.year}`, href: `/simple/awareness/year/${resolvedParams.year}` },
              { label: language === "ar" ? "المادة" : "Article" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل المادة" : "Error Loading Article"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل مادة التوعية. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading the awareness article. Please try again."
              }
            </p>
            <Link 
              href={`/simple/awareness/year/${resolvedParams.year}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-2xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {language === "ar" ? "العودة إلى السنة" : "Back to Year"}
                </>
              ) : (
                <>
                  {language === "ar" ? "العودة إلى السنة" : "Back to Year"}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
            { label: language === "ar" ? "مواد التوعية" : "Awareness Materials" },
            { label: language === "ar" ? "جميع السنوات" : "All Years", href: "/simple/awareness/years" },
            { label: `${resolvedParams.year}`, href: `/simple/awareness/year/${resolvedParams.year}` },
            { label: language === "ar" ? "المادة" : "Article" }
          ]} 
        />

        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href={`/simple/awareness/year/${resolvedParams.year}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 mb-8 group"
          >
            {isRtl ? (
              <>
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">{language === "ar" ? "العودة إلى السنة" : "Back to Year"}</span>
              </>
            ) : (
              <>
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">{language === "ar" ? "العودة إلى السنة" : "Back to Year"}</span>
              </>
            )}
          </Link>

          {/* Main Article Card */}
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Article Header */}
            <div className="p-8">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full border border-yellow-200 dark:border-yellow-800">
                  <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    {language === "ar" ? "مادة توعية" : "Awareness Material"}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {displayTitle}
              </h1>

              {/* Summary */}
              {displaySummary && (
                <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-xl border-l-4 border-yellow-500">
                  {displaySummary}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                {/* Date */}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">{formattedDate}</span>
                </div>

                {/* Year */}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm font-medium">{awareness.year}</span>
                </div>

                {/* Document Link */}
                {awareness.documentUrl && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <a 
                      href={awareness.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors duration-300"
                    >
                      {language === "ar" ? "تحميل المستند" : "Download Document"}
                    </a>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-yellow-600 dark:prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-yellow-500 prose-blockquote:bg-yellow-50 dark:prose-blockquote:bg-yellow-900/20"
                dangerouslySetInnerHTML={{ __html: purifiedContent }}
              />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center">
                        <Share2 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {language === "ar" ? "شارك هذه المادة" : "Share this article"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === "ar" ? "ساعد الآخرين في العثور على هذا المحتوى" : "Help others discover this content"}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigator.share?.({ title: displayTitle, url: window.location.href })}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>{language === "ar" ? "مشاركة" : "Share"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
