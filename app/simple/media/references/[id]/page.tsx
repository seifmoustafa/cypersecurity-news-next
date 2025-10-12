"use client"

import { use } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Share2,
  Download,
  FileText,
  Eye,
  TrendingUp
} from "lucide-react"
import { ShareButton } from "@/components/ui/share-button"
import Breadcrumbs from "@/components/breadcrumbs"
import { useReference } from "@/core/hooks/use-reference"
import { useReferences } from "@/core/hooks/use-references"
import { useReferenceBreadcrumbs } from "@/hooks/use-breadcrumbs"

interface ReferenceDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReferenceDetailPage({ params }: ReferenceDetailPageProps) {
  const { language } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  
  // Get breadcrumbs with dynamic data
  const { items: breadcrumbItems, isLoading: breadcrumbLoading } = useReferenceBreadcrumbs(resolvedParams.id)
  
  const { reference, loading, error } = useReference(resolvedParams.id)
  
  // Fetch related references (excluding current reference)
  const { references: relatedReferences } = useReferences("", 1, 5)
  const filteredRelatedReferences = relatedReferences.filter(item => item.id !== resolvedParams.id).slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Dynamic Breadcrumbs with Loading */}
          <Breadcrumbs items={breadcrumbItems} isLoading={breadcrumbLoading} />

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

  if (error || !reference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} isLoading={breadcrumbLoading} />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل المرجع" : "Error Loading Reference"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل المرجع. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading the reference. Please try again."
              }
            </p>
            <Link 
              href="/simple/media/references"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {isRtl ? (
                <>
                  <ArrowLeft className="h-5 w-5" />
                  {language === "ar" ? "العودة إلى المراجع" : "Back to References"}
                </>
              ) : (
                <>
                  {language === "ar" ? "العودة إلى المراجع" : "Back to References"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const displayTitle = language === "ar" ? reference.title : (reference.titleEn || reference.title)
  const displayDescription = language === "ar" ? reference.description : (reference.descriptionEn || reference.description)
  const displaySummary = language === "ar" ? reference.summary : (reference.summaryEn || reference.summary)
  const formattedDate = new Date(reference.createdAt).toLocaleDateString()

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
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-12 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-24 w-24 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "مرجع" : "Reference"}
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  {reference.pdfUrl && (
                    <div className="absolute bottom-6 right-6">
                      <a
                        href={reference.pdfUrl}
                        download
                        className="flex items-center gap-2 px-6 py-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                      >
                        <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
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
                    <div className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl border-l-4 border-blue-500">
                      {displaySummary}
                    </div>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "تاريخ الإنشاء" : "Created"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  {reference.pdfUrl && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                        <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {language === "ar" ? "متوفر للتحميل" : "Available for Download"}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          PDF
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              {displayDescription && (
                <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:rounded-xl prose-blockquote:p-6">
                  <div dangerouslySetInnerHTML={{ __html: displayDescription }} />
                </div>
              )}

              {/* Tags Section */}
              {reference.tags && reference.tags.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                      <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {language === "ar" ? "العلامات" : "Tags"}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {reference.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50 transition-all duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                      <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {language === "ar" ? "شارك هذا المرجع" : "Share this reference"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === "ar" ? "ساعد الآخرين في العثور على هذا المحتوى" : "Help others discover this content"}
                      </p>
                    </div>
                  </div>
                  
                  <ShareButton
                    title={displayTitle}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    text={language === "ar" ? `مرجع: ${displayTitle}` : `Reference: ${displayTitle}`}
                    className="font-medium"
                  >
                    {language === "ar" ? "مشاركة" : "Share"}
                  </ShareButton>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related References */}
              {filteredRelatedReferences.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {language === "ar" ? "مراجع ذات صلة" : "Related References"}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredRelatedReferences.map((relatedItem, index) => {
                      const relatedTitle = language === "ar" ? relatedItem.title : (relatedItem.titleEn || relatedItem.title)
                      const relatedDate = new Date(relatedItem.createdAt).toLocaleDateString()
                      
                      return (
                        <Link
                          key={relatedItem.id}
                          href={`/simple/media/references/${relatedItem.id}`}
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
                                {language === "ar" ? "عرض المرجع" : "View Reference"}
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {language === "ar" ? "معلومات المرجع" : "Reference Info"}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "تاريخ الإنشاء" : "Created"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formattedDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "النوع" : "Type"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {language === "ar" ? "مرجع" : "Reference"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ar" ? "التحميل" : "Download"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {reference.pdfUrl ? (language === "ar" ? "متوفر" : "Available") : (language === "ar" ? "غير متوفر" : "Not Available")}
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
