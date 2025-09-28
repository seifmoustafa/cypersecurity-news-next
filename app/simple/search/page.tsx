"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { useSearch } from "@/core/hooks/use-search"
import { useDebounce } from "@/hooks/use-debounce"
import { 
  Search, 
  Video, 
  BookOpen, 
  ShieldCheck,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Presentation,
  Newspaper,
  GraduationCap,
  FileText,
  Eye,
  Star,
  Play
} from "lucide-react"
import Link from "next/link"
import Breadcrumbs from "@/components/breadcrumbs"
import VideoModal from "@/components/video-modal"

export default function BeginnersSearchPage() {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedType, setSelectedType] = useState("all")
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  
  const debouncedQuery = useDebounce(query, 500)
  
  const { results, loading, error, pagination, metadata } = useSearch(
    debouncedQuery,
    currentPage,
    10,
    false,
    false,
    false
  )

  const entityTypes = [
    { id: "all", title: language === "ar" ? "الكل" : "All" },
    { id: "Article", title: language === "ar" ? "المقالات" : "Articles" },
    { id: "Video", title: language === "ar" ? "الفيديوهات" : "Videos" },
    { id: "Presentation", title: language === "ar" ? "العروض التقديمية" : "Presentations" },
    { id: "Lecture", title: language === "ar" ? "المحاضرات" : "Lectures" },
    { id: "News", title: language === "ar" ? "الأخبار" : "News" },
    { id: "Definition", title: language === "ar" ? "المفاهيم" : "Definitions" },
    { id: "Awareness", title: language === "ar" ? "التوعية" : "Awareness" },
    { id: "Reference", title: language === "ar" ? "المراجع" : "References" }
  ]

  const getTypeIcon = (entityType: string) => {
    switch (entityType) {
      case "Video": return Video
      case "Article": return FileText
      case "Definition": return BookOpen
      case "Presentation": return Presentation
      case "Lecture": return GraduationCap
      case "News": return Newspaper
      case "Awareness": return ShieldCheck
      case "Reference": return BookOpen
      default: return FileText
    }
  }

  const getTypeColor = (entityType: string) => {
    switch (entityType) {
      case "Video": return "from-red-500 to-pink-600"
      case "Article": return "from-blue-500 to-cyan-600"
      case "Definition": return "from-green-500 to-emerald-600"
      case "Presentation": return "from-purple-500 to-indigo-600"
      case "Lecture": return "from-orange-500 to-yellow-600"
      case "News": return "from-teal-500 to-green-600"
      case "Awareness": return "from-indigo-500 to-purple-600"
      case "Reference": return "from-gray-500 to-slate-600"
      default: return "from-gray-500 to-slate-600"
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString()
    
    // Convert to Arabic numerals
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    const convertToArabic = (str: string) => {
      return str.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)])
    }
    
    const formattedDate = `${day}/${month}/${year}`
    return convertToArabic(formattedDate)
  }

  const stripHtml = (html: string | null) => {
    if (!html) return ""
    return html.replace(/<[^>]*>/g, "")
  }

  const filteredResults = selectedType === "all" 
    ? results 
    : results.filter(result => result.entityType === selectedType)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId)
    setIsVideoModalOpen(true)
  }

  const handleCloseVideoModal = () => {
    setSelectedVideoId(null)
    setIsVideoModalOpen(false)
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
            { label: language === "ar" ? "البحث" : "Search" }
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
                placeholder={language === "ar" ? "ابحث في المحتوى..." : "Search content..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
              <Search className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-wrap gap-2">
            {entityTypes.map((entityType) => (
              <button
                key={entityType.id}
                onClick={() => setSelectedType(entityType.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedType === entityType.id
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {entityType.title}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Search className="h-5 w-5" />
              <span className="font-medium">
                {language === "ar" ? "خطأ في البحث" : "Search Error"}
              </span>
            </div>
            <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg h-[400px] animate-pulse">
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {!loading && filteredResults.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === "ar" ? "نتائج البحث" : "Search Results"}
                {metadata && (
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">
                    ({metadata.totalResults} {language === "ar" ? "نتيجة" : "results"})
                  </span>
                )}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResults.map((result, index) => {
                const IconComponent = getTypeIcon(result.entityType)
                const colorClass = getTypeColor(result.entityType)
                const displayTitle = result.title || (language === "ar" ? "بدون عنوان" : "No Title")
                const displaySummary = stripHtml(result.summary) || (language === "ar" ? "لا يوجد وصف" : "No description")
                const isVideo = result.entityType === "Video"
                
                const CardContent = () => (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.02] h-full will-change-transform overflow-hidden"
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
                    <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                      {result.imageUrl ? (
                        <img 
                          src={result.imageUrl} 
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`bg-gradient-to-r ${colorClass} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(result.createdTimestamp)}
                      </div>
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      {/* Result Header */}
                      <div className="flex items-center mb-6">
                        <div className={`bg-gradient-to-r ${colorClass} p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                            <Eye className="h-4 w-4" /> {result.entityType}
                          </div>
                        </div>
                      </div>

                      {/* Result Title */}
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                        {displayTitle}
                      </h3>

                      {/* Result Summary */}
                      <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                        {displaySummary}
                      </div>

                      {/* Highlights */}
                      {result.highlights && result.highlights.length > 0 && (
                        <div className="mb-6">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {language === "ar" ? "الكلمات المميزة:" : "Highlights:"}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {result.highlights.slice(0, 3).map((highlight, index) => (
                              <span key={index} className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                                {stripHtml(highlight)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Result Footer */}
                      <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-green-400">
                        <span className="mr-2 rtl:mr-0 rtl:ml-2">
                          {isVideo 
                            ? (language === "ar" ? "مشاهدة" : "Watch")
                            : (language === "ar" ? "عرض" : "View")
                          }
                        </span>
                        {isVideo ? (
                          <Play className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                        ) : isRtl ? (
                          <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                        ) : (
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                  </div>
                )

                return (
                  <div key={result.id} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                    {isVideo ? (
                      <button onClick={() => handleVideoClick(result.id)} className="w-full">
                        <CardContent />
                      </button>
                    ) : (
                      <Link href={result.navigationRoute} className="block">
                        <CardContent />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.pagesCount > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRtl ? (
                    <ArrowRight className="h-4 w-4" />
                  ) : (
                    <ArrowLeft className="h-4 w-4" />
                  )}
                  {language === "ar" ? "السابق" : "Previous"}
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.pagesCount) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          currentPage === page
                            ? "bg-green-500 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pagesCount}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {language === "ar" ? "التالي" : "Next"}
                  {isRtl ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && query && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "ar" ? "لا توجد نتائج" : "No Results Found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {language === "ar" 
                  ? "لم نتمكن من العثور على أي محتوى يطابق بحثك"
                  : "We couldn't find any content matching your search"
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        videoId={selectedVideoId}
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
      />
    </div>
  )
}
