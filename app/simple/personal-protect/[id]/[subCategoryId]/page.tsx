"use client"

import { use } from "react"
import { useLanguage } from "@/components/language-provider"
import { usePersonalProtectControls } from "@/core/hooks/use-personal-protect-controls"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-subcategories"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { Shield, Search, Calendar, ArrowRight, ArrowLeft, Eye, Users, Lock, Home, Settings } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import Breadcrumbs from "@/components/breadcrumbs"

interface PersonalProtectControlsPageProps {
  params: Promise<{
    id: string
    subCategoryId: string
  }>
}

export default function PersonalProtectControlsPage({ params }: PersonalProtectControlsPageProps) {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const categoryId = resolvedParams.id
  const subCategoryId = resolvedParams.subCategoryId
  
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const { controls, loading, error, pagination } = usePersonalProtectControls(subCategoryId, query, currentPage, pageSize)
  
  // Get category and subcategory info for breadcrumbs and title
  const { categories } = usePersonalProtectCategories("", 1, 100)
  const { subCategories } = usePersonalProtectSubCategories(categoryId, "", 1, 100)
  
  const currentCategory = categories.find(cat => cat.id === categoryId)
  const currentSubCategory = subCategories.find(sub => sub.id === subCategoryId)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && controls.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Breadcrumbs 
            items={[
              { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/simple/personal-protect" },
              { label: language === "ar" ? "الفئات الفرعية" : "Sub Categories", href: `/simple/personal-protect/${categoryId}` },
              { label: language === "ar" ? "الضوابط" : "Controls" }
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
              { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/simple/personal-protect" },
              { label: language === "ar" ? "الفئات الفرعية" : "Sub Categories", href: `/simple/personal-protect/${categoryId}` },
              { label: language === "ar" ? "الضوابط" : "Controls" }
            ]} 
          />

          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "خطأ في تحميل الضوابط" : "Error Loading Controls"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {language === "ar" 
                ? "حدث خطأ أثناء تحميل الضوابط. يرجى المحاولة مرة أخرى."
                : "An error occurred while loading controls. Please try again."
              }
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {language === "ar" ? "إعادة المحاولة" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const categoryName = currentCategory ? (language === "ar" ? currentCategory.name : currentCategory.nameEn || currentCategory.name) : ""
  const subCategoryName = currentSubCategory ? (language === "ar" ? currentSubCategory.name : currentSubCategory.nameEn || currentSubCategory.name) : ""

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
            { label: language === "ar" ? "الحماية الشخصية" : "Personal Protection", href: "/simple/personal-protect" },
            { label: categoryName || (language === "ar" ? "الفئات الفرعية" : "Sub Categories"), href: `/simple/personal-protect/${categoryId}` },
            { label: subCategoryName || (language === "ar" ? "الضوابط" : "Controls") }
          ]} 
        />

        {/* Sub Category Header */}
        {currentSubCategory && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {subCategoryName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "ar" ? "ضوابط الحماية الشخصية" : "Personal Protection Controls"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "ar" ? "ابحث في الضوابط..." : "Search controls..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Search className="h-6 w-6 text-white" />
            </button>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
          </form>
        </div>

        {/* Results Count */}
        {pagination && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar" 
                ? `تم العثور على ${pagination.itemsCount} ضابط`
                : `Found ${pagination.itemsCount} controls`
              }
            </p>
          </div>
        )}

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {controls.map((control, index) => {
            const displayName = language === "ar" ? control.name : (control.nameEn || control.name)
            const displayDescription = language === "ar" ? control.description : (control.descriptionEn || control.description)
            
            return (
              <Link 
                key={control.id} 
                href={`/simple/personal-protect/${categoryId}/${subCategoryId}/${control.id}`} 
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
                  <div className="relative aspect-video bg-gradient-to-br from-cyan-500 to-blue-600">
                    {control.imageUrl ? (
                      <img
                        src={control.imageUrl}
                        alt={displayName}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                          <Settings className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      {language === "ar" ? "ضابط" : "Control"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Control Header */}
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl mr-4 rtl:mr-0 rtl:ml-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <Settings className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> 
                          {new Date(control.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Control Title */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                      {displayName}
                    </h3>

                    {/* Control Footer */}
                    <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-green-400">
                      <span className="mr-2 rtl:mr-0 rtl:ml-2">
                        {language === "ar" ? "عرض إجراء التحكم" : "View Control"}
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
                        ? 'bg-green-600 text-white shadow-lg'
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
        {controls.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === "ar" ? "لا توجد ضوابط" : "No Controls Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar" 
                ? "لم يتم العثور على أي ضوابط تطابق البحث الخاص بك."
                : "No controls found matching your search."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
