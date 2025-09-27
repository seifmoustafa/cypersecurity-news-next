"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Presentation, ArrowRight, ArrowLeft, Star, BookOpen, Search, Calendar, Download, ArrowUpLeft, Tag, Share2, TrendingUp } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { container } from "@/core/di/container"
import type { ApiPresentation } from "@/core/domain/models/media"

interface PresentationDetailPageProps {
  params: Promise<{
    id: string
    presentationId: string
  }>
}

export default function PresentationDetailPage({ params }: PresentationDetailPageProps) {
  const router = useRouter()
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [presentation, setPresentation] = useState<ApiPresentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [presentationName, setPresentationName] = useState<string>("")

  // Unwrap the params Promise
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        setLoading(true)
        setError(null)
        const presentationData = await container.services.media.getApiPresentationById(resolvedParams.presentationId)
        setPresentation(presentationData)
        if (presentationData) {
          setPresentationName(language === "ar" ? presentationData.nameAr : presentationData.nameEn || presentationData.nameAr)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.presentationId) {
      fetchPresentation()
    }
  }, [resolvedParams.presentationId, language])

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
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-3xl animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center py-12">
          <Presentation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar" ? "حدث خطأ في تحميل العرض التقديمي" : "Error loading presentation"}
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    )
  }

  const displayTitle = language === "ar" ? presentation.nameAr : presentation.nameEn || presentation.nameAr
  const displaySummary = language === "ar" ? presentation.summaryAr : presentation.summaryEn || presentation.summaryAr
  const formattedDate = new Date(presentation.createdAt).toLocaleDateString()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
            { label: language === "ar" ? "دروس تعليمية" : "Educational Lessons", href: "/simple/media/lessons" },
            { label: language === "ar" ? "فئات العروض التقديمية" : "Presentation Categories", href: "/simple/media/lessons/presentations" },
            { label: language === "ar" ? "فئة العروض التقديمية" : "Presentation Category", href: `/simple/media/lessons/presentations/${resolvedParams.id}` },
            { label: presentationName || (language === "ar" ? "جاري التحميل..." : "Loading...") }
          ]} 
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <div className="relative group">
                <div className="relative h-96 overflow-hidden rounded-3xl shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-8">
                      <Presentation className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "عرض تقديمي تعليمي" : "Educational Presentation"}
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  {presentation.presentationUrl && (
                    <div className="absolute bottom-6 right-6">
                      <a
                        href={presentation.presentationUrl}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-gray-900 dark:text-white rounded-full shadow-lg border border-white/20 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 transition-colors duration-300"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {language === "ar" ? "تحميل" : "Download"}
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

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

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                      <Presentation className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "نوع المحتوى" : "Content Type"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "عرض تقديمي" : "Presentation"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                    <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {language === "ar" ? "التصنيفات" : "Categories"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {presentation.forBeginners && (
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full border border-purple-200 dark:border-purple-800 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50 transition-all duration-300">
                      {language === "ar" ? "للمبتدئين" : "For Beginners"}
                    </span>
                  )}
                  {presentation.forProfessionals && (
                    <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200 text-sm font-medium rounded-full border border-green-200 dark:border-green-800 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/50 dark:hover:to-emerald-800/50 transition-all duration-300">
                      {language === "ar" ? "للمحترفين" : "For Professionals"}
                    </span>
                  )}
                </div>
              </div>

              {/* Share Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                      <Share2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "شارك هذا العرض التقديمي" : "Share this presentation"}
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
                      {language === "ar" ? "تاريخ النشر" : "Published"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formattedDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "نوع المحتوى" : "Content Type"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {language === "ar" ? "عرض تقديمي" : "Presentation"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "المستوى" : "Level"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {presentation.forBeginners && presentation.forProfessionals 
                        ? (language === "ar" ? "جميع المستويات" : "All Levels")
                        : presentation.forBeginners 
                        ? (language === "ar" ? "مبتدئ" : "Beginner")
                        : (language === "ar" ? "محترف" : "Professional")
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Section */}
              {presentation.presentationUrl && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                      <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {language === "ar" ? "تحميل العرض التقديمي" : "Download Presentation"}
                    </h2>
                  </div>
                  
                  <a
                    href={presentation.presentationUrl}
                    download
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Download className="h-5 w-5" />
                    <span>{language === "ar" ? "تحميل العرض التقديمي" : "Download Presentation"}</span>
                  </a>
                </div>
              )}

              {/* Back to Category */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                <Link
                  href={`/simple/media/lessons/presentations/${resolvedParams.id}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 font-medium"
                >
                  <ArrowUpLeft className="h-5 w-5" />
                  <span>{language === "ar" ? "العودة للفئة" : "Back to Category"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
