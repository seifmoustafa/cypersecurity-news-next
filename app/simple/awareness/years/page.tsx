"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { Calendar, ArrowRight, ArrowLeft, BookOpen, Lightbulb } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import type { AwarenessYear } from "@/core/domain/models/awareness"

export default function AwarenessYearsPage() {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [years, setYears] = useState<AwarenessYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.awareness.getAllAwarenessYears("", 1, 100)
        setYears(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setYears([])
      } finally {
        setLoading(false)
      }
    }

    fetchYears()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "مواد التوعية" : "Awareness Materials" }
            ]} 
          />

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 animate-pulse">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || years.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "مواد التوعية" : "Awareness Materials" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "لا توجد سنوات متاحة" : "No Years Available"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "لم يتم العثور على أي سنوات توعية متاحة."
                : "No awareness years were found."
              }
            </p>
            <Link 
              href="/simple/awareness"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-2xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {language === "ar" ? "العودة إلى مواد التوعية" : "Back to Awareness Materials"}
                </>
              ) : (
                <>
                  {language === "ar" ? "العودة إلى مواد التوعية" : "Back to Awareness Materials"}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
            { label: language === "ar" ? "مواد التوعية" : "Awareness Materials" }
          ]} 
        />

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-2xl flex items-center justify-center">
              <Calendar className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {language === "ar" ? "مواد التوعية حسب السنوات" : "Awareness Materials by Years"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {language === "ar" 
                  ? "تصفح مواد التوعية الأمنية حسب السنة"
                  : "Browse cybersecurity awareness materials by year"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Years Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {years.map((year, index) => (
              <Link
                key={year.id}
                href={`/simple/awareness/year/${year.year}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  {/* Year Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>

                  {/* Year Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                      {year.year}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {language === "ar" ? "سنة التوعية" : "Awareness Year"}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors duration-300">
                      {language === "ar" ? "عرض المواد" : "View Materials"}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-5 w-5 text-yellow-600 dark:text-yellow-400 group-hover:-translate-x-1 transition-transform duration-300" />
                    ) : (
                      <ArrowRight className="h-5 w-5 text-yellow-600 dark:text-yellow-400 group-hover:translate-x-1 transition-transform duration-300" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
