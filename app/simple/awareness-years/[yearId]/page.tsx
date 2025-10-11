"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Calendar, ArrowRight, ArrowLeft, Search, BookOpen, Lightbulb } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useAwarenessByYearId } from "@/core/hooks/use-awareness"
import { useAwarenessYears } from "@/core/hooks/use-awareness"
import { useDebounce } from "@/hooks/use-debounce"
import { use } from "react"

interface AwarenessYearPageProps {
  params: Promise<{
    yearId: string
  }>
}

export default function AwarenessYearPage({ params }: AwarenessYearPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  
  const { data: awarenessData, loading, error } = useAwarenessByYearId(resolvedParams.yearId, debouncedQuery, 1, 100)
  const { data: yearsData } = useAwarenessYears("", 1, 50)
  const instructions = awarenessData?.data || []
  const years = yearsData?.data || []
  
  // Find the current year
  const currentYear = years.find(year => year.id === resolvedParams.yearId)

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
    { label: currentYear ? currentYear.year : t('awareness.loading') }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Search Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === "ar" ? "ابحث في نشرات التوعية..." : "Search awareness bulletins..."}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
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
          <Breadcrumbs items={breadcrumbItems} />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل نشرات التوعية" : "Error Loading Awareness Bulletins"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل نشرات التوعية لهذه السنة. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading awareness bulletins for this year. Please try again."
              }
            </p>
            <Link 
              href="/simple/awareness-years"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {t('awareness.backToYears')}
                </>
              ) : (
                <>
                  {t('awareness.backToYears')}
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

        {/* Header */}
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {currentYear ? currentYear.year : t('awareness.loading')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === "ar" 
              ? `نشرات التوعية الأمنية لعام ${currentYear?.year || ''}`
              : `Security awareness bulletins for ${currentYear?.year || ''}`
            }
          </p>
        </div> */}

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "ar" ? "ابحث في نشرات التوعية..." : "Search awareness bulletins..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Awareness Grid */}
        {instructions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('awareness.noAwarenessInYear')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {language === "ar" 
                ? "لم يتم العثور على نشرات توعية في هذه السنة."
                : "No awareness bulletins found in this year."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructions.map((instruction, index) => (
              <Link
                key={instruction.id}
                href={`/simple/awareness-years/${resolvedParams.yearId}/${instruction.id}`}
                className="group block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden rounded-t-3xl">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                      <Lightbulb className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {language === "ar" ? "نشرة توعية" : "Awareness"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                      {language === "ar" ? instruction.title : (instruction.titleEn || instruction.title)}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {language === "ar" ? instruction.summary : (instruction.summaryEn || instruction.summary)}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {language === "ar" 
                            ? new Date(instruction.createdAt).toLocaleDateString('ar-SA')
                            : new Date(instruction.createdAt).toLocaleDateString('en-US')
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        <span className="text-sm font-medium">
                          {t('awareness.readMore')}
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
