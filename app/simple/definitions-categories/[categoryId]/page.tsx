"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { BookOpen, Search, ArrowRight, ArrowLeft, Calendar } from "lucide-react"
import Breadcrumbs from "@/components/breadcrumbs"
import { useDebounce } from "@/hooks/use-debounce"
import { useDefinitions } from "@/core/hooks/use-definitions"
import { formatDateArabicNumbers, formatDate } from "@/lib/content-purifier"

interface CategoryPageProps {
  params: Promise<{
    categoryId: string
  }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)

  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const { categoryId } = resolvedParams
  const { definitions, loading, error } = useDefinitions(categoryId, 1, 100, debouncedQuery)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-8">
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Search Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "دليل المصطلحات" : "Definitions", href: "/simple/definitions-categories" },
              { label: language === "ar" ? "الفئة" : "Category" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل دليل المصطلحات" : "Error Loading Definitions"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل دليل المصطلحات لهذه الفئة. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading definitions for this category. Please try again."
              }
            </p>
            <Link 
              href="/simple/definitions-categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  العودة إلى الفئات
                </>
              ) : (
                <>
                  Back to Categories
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "دليل المصطلحات" : "Definitions", href: "/simple/definitions-categories" },
            { label: language === "ar" ? "الفئة" : "Category" }
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
                placeholder={language === "ar" ? "ابحث في دليل المصطلحات..." : "Search definitions..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Definitions Grid */}
        {definitions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {query ? 
                (language === "ar" ? "لا توجد مفاهيم مطابقة للبحث" : "No definitions match your search") :
                (language === "ar" ? "لا توجد مفاهيم متاحة" : "No definitions available")
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {query ? 
                (language === "ar" ? "جرب البحث بكلمات مختلفة" : "Try searching with different keywords") :
                (language === "ar" ? "سيتم إضافة المزيد من دليل المصطلحات قريباً" : "More definitions will be added soon")
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {definitions.map((definition) => {
              const displayTerm = language === "ar" ? definition.term : (definition.termEn || definition.term)
              const displayDefinition = language === "ar" ? definition.definitionText : (definition.definitionEn || definition.definitionText)
              const formattedDate = language === "ar" ? formatDateArabicNumbers(definition.createdAt) : formatDate(definition.createdAt)
              
              return (
                <Link
                  key={definition.id}
                  href={`/simple/definitions-categories/${categoryId}/${definition.id}`}
                  className="group block"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/20 hover:-translate-y-1 h-full">
                    {/* Definition Content */}
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                          {displayTerm}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {displayDefinition}
                        </p>
                      </div>
                      
                      {/* Meta Information */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{formattedDate}</span>
                        </div>
                        {isRtl ? (
                          <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                        ) : (
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}