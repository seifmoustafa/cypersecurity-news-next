"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { Calendar, ArrowRight, ArrowLeft, BookOpen, Lightbulb, Search } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useDebounce } from "@/hooks/use-debounce"
import { purifyContent, extractTextContent, formatDateArabicNumbers, formatDate } from "@/lib/content-purifier"
import type { AwarenessYear } from "@/core/domain/models/awareness"
import { use } from "react"

interface YearAwarenessPageProps {
  params: Promise<{
    year: string
  }>
}

export default function YearAwarenessPage({ params }: YearAwarenessPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const [yearData, setYearData] = useState<AwarenessYear | null>(null)
  const [awareness, setAwareness] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const year = parseInt(resolvedParams.year)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // First, get all years to find the year ID
        const yearsResponse = await container.services.awareness.getAllAwarenessYears("", 1, 100)
        const foundYear = yearsResponse.data.find((y) => y.year.toString() === resolvedParams.year)
        
        if (!foundYear) {
          throw new Error(`Year ${resolvedParams.year} not found`)
        }
        
        // Set year data
        setYearData(foundYear)
        
        // Get awareness materials for this year using the year ID
        const response = await container.services.awareness.getAwarenessByYearId(foundYear.id, debouncedQuery, 1, 100)
        setAwareness(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setAwareness([])
        setYearData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.year, debouncedQuery])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "نشرات التوعية" : "Awareness Materials" },
              { label: language === "ar" ? "جميع السنوات" : "All Years", href: "/simple/awareness/years" },
              { label: `${year}` }
            ]} 
          />

          <div className="max-w-4xl mx-auto">
            {/* Search Skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8 animate-pulse">
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            </div>

            {/* Content Skeleton */}
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

  if (error || !yearData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "التوعية والأخبار" : "Awareness & News", href: "/simple/awareness" },
              { label: language === "ar" ? "نشرات التوعية" : "Awareness Materials" },
              { label: language === "ar" ? "جميع السنوات" : "All Years", href: "/simple/awareness/years" },
              { label: `${year}` }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل السنة" : "Error Loading Year"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل نشرات التوعية لهذه السنة. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading awareness materials for this year. Please try again."
              }
            </p>
            <Link 
              href="/simple/awareness/years"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {language === "ar" ? "العودة إلى جميع السنوات" : "Back to All Years"}
                </>
              ) : (
                <>
                  {language === "ar" ? "العودة إلى جميع السنوات" : "Back to All Years"}
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
            { label: language === "ar" ? "نشرات التوعية" : "Awareness Materials" },
            { label: language === "ar" ? "جميع السنوات" : "All Years", href: "/simple/awareness/years" },
            { label: `${year}` }
          ]} 
        />

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
              <Calendar className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {language === "ar" ? `نشرات التوعية لسنة ${year}` : `Awareness Materials for ${year}`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {language === "ar" 
                  ? `تصفح نشرات التوعية الأمنية لسنة ${year}`
                  : `Browse cybersecurity awareness materials for ${year}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === "ar" ? `ابحث في نشرات التوعية لسنة ${year}...` : `Search awareness materials for ${year}...`}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {awareness.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {debouncedQuery 
                  ? (language === "ar" ? "لا توجد نشرات تطابق البحث" : "No materials match your search")
                  : (language === "ar" ? "لا توجد نشرات متاحة" : "No materials available")
                }
              </h3>
              <p className="text-muted-foreground">
                {debouncedQuery
                  ? (language === "ar"
                      ? "جرب البحث بكلمات مختلفة"
                      : "Try searching with different keywords")
                  : (language === "ar"
                      ? `لم يتم العثور على أي نشرات توعية لسنة ${year}`
                      : `No awareness materials found for ${year}`)
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awareness.map((item, index) => {
                const displayTitle = language === "ar" ? item.title : (item.titleEn || item.title)
                const displaySummary = language === "ar" ? item.summary : (item.summaryEn || item.summary)
                const formattedDate = language === "ar" ? formatDateArabicNumbers(item.createdAt) : formatDate(item.createdAt)
                
                return (
                  <Link
                    key={item.id}
                    href={`/simple/awareness/${item.year}/${item.id}`}
                    className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 line-clamp-2">
                        {displayTitle}
                      </h3>

                      {/* Summary */}
                      {displaySummary && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                          {displaySummary}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">
                          {language === "ar" ? "اقرأ المزيد" : "Read More"}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className="h-4 w-4 text-teal-600 dark:text-teal-400 group-hover:-translate-x-1 transition-transform duration-300" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
