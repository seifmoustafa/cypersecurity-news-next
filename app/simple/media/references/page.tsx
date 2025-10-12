"use client"

import { useLanguage } from "@/components/language-provider"
import { useReferences } from "@/core/hooks/use-references"
import { BookOpen, Search, Calendar, ArrowRight, ArrowLeft, Download, FileText, Tag } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import Breadcrumbs from "@/components/breadcrumbs"

export default function ReferencesPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const { references, loading, error, pagination } = useReferences(query, currentPage, pageSize)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && references.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
              { label: language === "ar" ? "المراجع" : "References" }
            ]} 
          />

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-96 animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-3xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
              { label: language === "ar" ? "المراجع" : "References" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل المراجع" : "Error Loading References"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل المراجع. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading references. Please try again."
              }
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {language === "ar" ? "إعادة المحاولة" : "Try Again"}
            </button>
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
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: language === "ar" ? "المكتبة الثقافية" : "Media Library", href: "/simple/media" },
            { label: language === "ar" ? "المراجع" : "References" }
          ]} 
        />

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "ar" ? "ابحث في المراجع..." : "Search references..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Search className="h-6 w-6 text-white" />
            </button>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </form>
        </div>

        {/* Results Count */}
        {pagination && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar" 
                ? `تم العثور على ${pagination.itemsCount} مرجع`
                : `Found ${pagination.itemsCount} references`
              }
            </p>
          </div>
        )}

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {references.map((reference, index) => {
            const displayTitle = language === "ar" ? reference.title : (reference.titleEn || reference.title)
            
            return (
              <Link 
                key={reference.id} 
                href={`/simple/media/references/${reference.id}`} 
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
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
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-sky-500 to-blue-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      {language === "ar" ? "مرجع" : "Reference"}
                    </div>
                    {reference.pdfUrl && (
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <Download className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Reference Header */}
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> 
                          {new Date(reference.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Reference Title */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                      {displayTitle}
                    </h3>

                    {/* Reference Footer */}
                    <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-blue-400">
                      <span className="mr-2 rtl:mr-0 rtl:ml-2">
                        {language === "ar" ? "عرض المرجع" : "View Reference"}
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
            )
          })}
        </div>

        {/* Pagination */}
        {pagination && pagination.pagesCount > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pagesCount) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pagesCount}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {references.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === "ar" ? "لا توجد مراجع" : "No References Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar" 
                ? "لم يتم العثور على أي مراجع تطابق البحث الخاص بك."
                : "No references found matching your search."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
