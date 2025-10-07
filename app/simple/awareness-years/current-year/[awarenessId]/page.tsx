"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Calendar, ArrowRight, ArrowLeft, Lightbulb, BookOpen, Clock } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useCurrentYearAwareness } from "@/core/hooks/use-current-year-awareness"
import { useAwarenessById } from "@/core/hooks/use-awareness"

interface CurrentYearAwarenessDetailPageProps {
  params: Promise<{
    awarenessId: string
  }>
}

export default function CurrentYearAwarenessDetailPage({ params }: CurrentYearAwarenessDetailPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  
  const { awareness: awarenessList } = useCurrentYearAwareness("", 1, 100)
  const { awareness: awareness, loading, error } = useAwarenessById(resolvedParams.awarenessId)
  
  // Get current year
  const currentYear = new Date().getFullYear().toString()

  const t = (key: string) => {
    const keys = key.split('.')
    let value = language === "ar" ? require('@/locales/ar.json') : require('@/locales/en.json')
    for (const k of keys) {
      value = value[k]
    }
    return value || key
  }

  const breadcrumbItems = [
    { label: t('nav.home'), href: "/simple" },
    { label: t('awareness.title'), href: "/simple/awareness" },
    { label: t('awareness.years'), href: "/simple/awareness-years" },
    { label: language === "ar" ? `السنة الحالية (${currentYear})` : `Current Year (${currentYear})`, href: "/simple/awareness-years/current" },
    { label: awareness ? (language === "ar" ? awareness.title : awareness.titleEn || awareness.title) : t('awareness.loading') }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
              {/* Loading Header */}
              <div className="h-64 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
              
              {/* Loading Content */}
              <div className="p-8 space-y-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !awareness) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل نشرة التوعية" : "Error Loading Awareness Bulletin"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل نشرة التوعية. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading the awareness bulletin. Please try again."
              }
            </p>
            <Link 
              href="/simple/awareness-years/current"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {language === "ar" ? "العودة إلى السنة الحالية" : "Back to Current Year"}
                </>
              ) : (
                <>
                  {language === "ar" ? "العودة إلى السنة الحالية" : "Back to Current Year"}
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
        <Breadcrumbs items={breadcrumbItems} />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === "ar" ? awareness.title : awareness.titleEn || awareness.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">{currentYear}</span>
                </div>
              </div>
              
              {/* Current Year Badge */}
              <div className="absolute top-6 right-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {language === "ar" ? "السنة الحالية" : "Current Year"}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === "ar" ? "الوصف" : "Description"}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {language === "ar" 
                      ? awareness.description || "نشرة توعية أمنية مهمة للسنة الحالية"
                      : awareness.descriptionEn || awareness.description || "Important security awareness bulletin for the current year"
                    }
                  </p>
                </div>
              </div>

              {/* Additional Content */}
              {(awareness.content || awareness.contentEn) && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === "ar" ? "المحتوى التفصيلي" : "Detailed Content"}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: language === "ar" ? awareness.content || "" : awareness.contentEn || awareness.content || ""
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Meta Information */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "السنة" : "Year"}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {currentYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "النوع" : "Type"}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "نشرة توعية" : "Awareness Bulletin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="flex justify-center pt-8">
                <Link 
                  href="/simple/awareness-years/current"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  {isRtl ? (
                    <>
                      <ArrowLeft className="h-5 w-5" />
                      {language === "ar" ? "العودة إلى السنة الحالية" : "Back to Current Year"}
                    </>
                  ) : (
                    <>
                      {language === "ar" ? "العودة إلى السنة الحالية" : "Back to Current Year"}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
