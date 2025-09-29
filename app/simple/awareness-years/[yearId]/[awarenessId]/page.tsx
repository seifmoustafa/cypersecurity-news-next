"use client"

import { use } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { 
  Lightbulb, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Share2,
  BookOpen,
  Eye,
  TrendingUp
} from "lucide-react"
import { ShareButton } from "@/components/ui/share-button"
import Breadcrumbs from "@/components/breadcrumbs"
import { useAwarenessById } from "@/core/hooks/use-awareness"
import { useAwarenessByYearId } from "@/core/hooks/use-awareness"
import { useAwarenessYears } from "@/core/hooks/use-awareness"
import { purifyContent, extractTextContent, formatDate, formatDateArabicNumbers } from "@/lib/content-purifier"

interface AwarenessDetailPageProps {
  params: Promise<{
    yearId: string
    awarenessId: string
  }>
}

export default function AwarenessDetailPage({ params }: AwarenessDetailPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  
  const { data: instruction, loading, error } = useAwarenessById(resolvedParams.awarenessId)
  const { data: yearsData } = useAwarenessYears("", 1, 50)
  const { data: instructionsData } = useAwarenessByYearId(resolvedParams.yearId, "", 1, 100)
  const years = yearsData?.data || []
  const instructions = instructionsData?.data || []
  
  // Find the current year
  const currentYear = years.find(year => year.id === resolvedParams.yearId)
  
  // Get related awareness (excluding current)
  const filteredRelatedAwareness = instructions.filter(item => item.id !== resolvedParams.awarenessId).slice(0, 4)

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
    { 
      label: currentYear ? currentYear.year : t('awareness.loading'),
      href: `/simple/awareness-years/${resolvedParams.yearId}`
    },
    { 
      label: instruction ? (language === "ar" ? instruction.title : (instruction.titleEn || instruction.title)) : t('awareness.loading')
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Content Skeleton */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-3xl mb-8 animate-pulse"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8 w-3/4 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !instruction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل النشرة" : "Error Loading Bulletin"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل نشرة التوعية. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading the awareness bulletin. Please try again."
              }
            </p>
            <Link 
              href={`/simple/awareness-years/${resolvedParams.yearId}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {t('awareness.backToYear')}
                </>
              ) : (
                <>
                  {t('awareness.backToYear')}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const purifiedContent = purifyContent(instruction.content)
  const displayTitle = language === "ar" ? instruction.title : (instruction.titleEn || instruction.title)
  const formattedDate = language === "ar" ? formatDateArabicNumbers(instruction.createdAt) : formatDate(instruction.createdAt)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <div className="relative group">
                <div className="relative h-96 overflow-hidden rounded-3xl shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                    <Lightbulb className="h-32 w-32 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "نشرة توعية" : "Awareness"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Header */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {displayTitle}
                  </h1>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('awareness.published')}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:rounded-xl prose-blockquote:p-6"
                dangerouslySetInnerHTML={{ __html: purifiedContent }}
              />

              {/* Share Section */}
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 rounded-full flex items-center justify-center">
                      <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('awareness.shareAwareness')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('awareness.shareDescription')}
                      </p>
                    </div>
                  </div>
                  
                  <ShareButton
                    title={displayTitle}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    text={language === "ar" ? `نشرة توعية: ${displayTitle}` : `Awareness Bulletin: ${displayTitle}`}
                    className="font-medium"
                  >
                    {t('awareness.share')}
                  </ShareButton>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related Articles */}
              {filteredRelatedAwareness.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('awareness.relatedAwareness')}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredRelatedAwareness.map((relatedItem, index) => {
                      const relatedTitle = language === "ar" ? relatedItem.title : (relatedItem.titleEn || relatedItem.title)
                      const relatedDate = language === "ar" ? formatDateArabicNumbers(relatedItem.createdAt) : formatDate(relatedItem.createdAt)
                      
                      return (
                        <Link
                          key={relatedItem.id}
                          href={`/simple/awareness-years/${resolvedParams.yearId}/${relatedItem.id}`}
                          className="group block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-600"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                              {relatedTitle}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{relatedDate}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                                {t('awareness.readMore')}
                              </span>
                              {isRtl ? (
                                <ArrowLeft className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform duration-300" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('awareness.quickStats')}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('awareness.wordCount')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {extractTextContent(instruction.content).split(' ').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('awareness.published')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formattedDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('awareness.category')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {language === "ar" ? "التوعية" : "Awareness"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
