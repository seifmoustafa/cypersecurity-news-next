"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import { Calendar, ArrowRight, ArrowLeft, BookOpen, Search } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useDebounce } from "@/hooks/use-debounce"
import type { AwarenessYear } from "@/core/domain/models/awareness"

export default function AwarenessYearsPage() {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [years, setYears] = useState<AwarenessYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await container.services.awareness.getAllAwarenessYears(debouncedQuery, 1, 100)
        setYears(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setYears([])
      } finally {
        setLoading(false)
      }
    }

    fetchYears()
  }, [debouncedQuery])

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
              { label: language === "ar" ? "نشرات التوعية" : "Awareness Materials" }
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
                  placeholder={language === "ar" ? "ابحث في السنوات..." : "Search years..."}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-yellow-500 outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-[350px] animate-pulse">
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {language === "ar" ? "حدث خطأ في تحميل السنوات" : "Error loading years"}
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
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
            { label: language === "ar" ? "نشرات التوعية" : "Awareness Materials" }
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
                placeholder={language === "ar" ? "ابحث في السنوات..." : "Search years..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-yellow-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Years Grid */}
        {years.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {debouncedQuery 
                ? (language === "ar" ? "لا توجد سنوات تطابق البحث" : "No years match your search")
                : (language === "ar" ? "لا توجد سنوات متاحة" : "No years available")
              }
            </h3>
            <p className="text-muted-foreground">
              {debouncedQuery
                ? (language === "ar"
                    ? "جرب البحث بكلمات مختلفة"
                    : "Try searching with different keywords")
                : (language === "ar"
                    ? "لم يتم العثور على أي سنوات توعية"
                    : "No awareness years found")
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {years.map((year, index) => (
              <Link
                key={year.id}
                href={`/simple/awareness/year/${year.year}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    const rect = el.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const rotateX = ((y - rect.height / 2) / rect.height) * -3
                    const rotateY = ((x - rect.width / 2) / rect.width) * 3
                    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)"
                  }}
                  style={{ transform: "perspective(900px)" }}
                >
                  {/* Year Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-yellow-500 to-amber-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      {language === "ar" ? "سنة توعية" : "Awareness Year"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Year Header */}
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" /> {year.year}
                        </div>
                      </div>
                    </div>

                    {/* Year Title */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                      {year.year}
                    </h3>

                    {/* Year Description */}
                    <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                      {language === "ar" 
                        ? "تصفح نشرات التوعية لهذا العام" 
                        : "Browse awareness materials for this year"}
                    </div>

                    {/* Year Footer */}
                    <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-yellow-400">
                      <span className="mr-2 rtl:mr-0 rtl:ml-2">
                        {language === "ar" ? "عرض النشرات" : "View Materials"}
                      </span>
                      {isRtl ? (
                        <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                      ) : (
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      )}
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
