"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { GraduationCap, ArrowRight, ArrowLeft, Star, BookOpen, Search, FileText, Clock, Calendar, Download, ArrowUpLeft, Tag, Share2, TrendingUp } from "lucide-react"
import { ShareButton } from "@/components/ui/share-button"
import Breadcrumbs from "@/components/breadcrumbs"
import { container } from "@/core/di/container"
import { useLectureBreadcrumbs } from "@/hooks/use-breadcrumbs"
import type { ApiLecture } from "@/core/domain/models/media"

interface LectureDetailPageProps {
  params: Promise<{
    id: string
    lectureId: string
  }>
}

export default function LectureDetailPage({ params }: LectureDetailPageProps) {
  const router = useRouter()
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [lecture, setLecture] = useState<ApiLecture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lectureName, setLectureName] = useState<string>("")

  // Unwrap the params Promise
  const resolvedParams = use(params)
  
  // Get breadcrumbs with dynamic data
  const { items: breadcrumbItems, isLoading: breadcrumbLoading } = useLectureBreadcrumbs(resolvedParams.id, resolvedParams.lectureId)

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true)
        setError(null)
        const lectureData = await container.services.media.getApiLectureById(resolvedParams.lectureId)
        setLecture(lectureData)
        if (lectureData) {
          setLectureName(language === "ar" ? lectureData.nameAr : lectureData.nameEn || lectureData.nameAr)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.lectureId) {
      fetchLecture()
    }
  }, [resolvedParams.lectureId, language])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Dynamic Breadcrumbs with Loading */}
          <Breadcrumbs items={breadcrumbItems} isLoading={breadcrumbLoading} />

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

  if (error || !lecture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar" ? "حدث خطأ في تحميل المحاضرة" : "Error loading lecture"}
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    )
  }

  const displayTitle = language === "ar" ? lecture.nameAr : lecture.nameEn || lecture.nameAr
  const displaySummary = language === "ar" ? lecture.summaryAr : lecture.summaryEn || lecture.summaryAr
  const displayContent = language === "ar" ? lecture.contentAr : lecture.contentEn || lecture.contentAr
  const formattedDate = new Date(lecture.createdAt).toLocaleDateString()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Dynamic Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} isLoading={breadcrumbLoading} />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <div className="relative group">
                <div className="relative h-96 overflow-hidden rounded-3xl shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-8">
                      <FileText className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "محاضرة تعليمية" : "Educational Lecture"}
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  {lecture.documentUrl && (
                    <div className="absolute bottom-6 right-6">
                      <a
                        href={lecture.documentUrl}
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
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "نوع المحتوى" : "Content Type"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "محاضرة" : "Lecture"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              {displayContent && (
                <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-900/20 prose-blockquote:rounded-xl prose-blockquote:p-6"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              )}

              {/* Tags Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {language === "ar" ? "التصنيفات" : "Categories"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {lecture.forBeginners && (
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800 hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800/50 dark:hover:to-purple-800/50 transition-all duration-300">
                      {language === "ar" ? "للعامة" : "For Beginners"}
                    </span>
                  )}
                  {lecture.forProfessionals && (
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
                        {language === "ar" ? "شارك هذه المحاضرة" : "Share this lecture"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === "ar" ? "ساعد الآخرين في العثور على هذا المحتوى" : "Help others discover this content"}
                      </p>
                    </div>
                  </div>
                  
                  <ShareButton
                    title={displayTitle}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    text={language === "ar" ? `محاضرة: ${displayTitle}` : `Lecture: ${displayTitle}`}
                    className="font-medium"
                  >
                    {language === "ar" ? "مشاركة" : "Share"}
                  </ShareButton>
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
                      {language === "ar" ? "محاضرة" : "Lecture"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "المستوى" : "Level"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {lecture.forBeginners && lecture.forProfessionals 
                        ? (language === "ar" ? "جميع المستويات" : "All Levels")
                        : lecture.forBeginners 
                        ? (language === "ar" ? "مبتدئ" : "Beginner")
                        : (language === "ar" ? "محترف" : "Professional")
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Section */}
              {lecture.documentUrl && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                      <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {language === "ar" ? "تحميل المحاضرة" : "Download Lecture"}
                    </h2>
                  </div>
                  
                  <a
                    href={lecture.documentUrl}
                    download
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Download className="h-5 w-5" />
                    <span>{language === "ar" ? "تحميل المحاضرة" : "Download Lecture"}</span>
                  </a>
                </div>
              )}

              {/* Back to Category */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                <Link
                  href={`/simple/media/lessons/lectures/${resolvedParams.id}`}
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