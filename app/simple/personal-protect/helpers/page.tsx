"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import Breadcrumbs from "@/components/breadcrumbs"
import { useHelperCategories } from "@/hooks/use-helper-categories"
import { useHelpersByCategory } from "@/hooks/use-helper-categories"
import { BookOpen, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, X, Maximize2 } from "lucide-react"
import { getFullImageUrl } from "@/lib/utils"

export default function HelperCategoriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const isRtl = language === "ar"

  const selectedCategoryId = searchParams.get("category") || ""
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)

  // Fetch all categories for sidebar
  const { categories: allCategories, loading: categoriesLoading, error: categoriesError } = useHelperCategories(1, 100)
  
  // Fetch helpers for selected category
  const { helpers, loading: helpersLoading, pagination } = useHelpersByCategory(
    selectedCategoryId,
    1,
    100
  )

  const selectedCategory = allCategories.find(cat => cat.id === selectedCategoryId)

  // Reset carousel when category changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategoryId])

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && helpers.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % helpers.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlay, helpers.length])

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/simple/personal-protect/helpers?category=${categoryId}`)
  }

  const handleHelperClick = (helperId: string) => {
    router.push(`/simple/personal-protect/helpers/${selectedCategoryId}/${helperId}`)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + helpers.length) % helpers.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % helpers.length)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
  }

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index)
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  const goToFullscreenPrevious = () => {
    setFullscreenIndex((prev) => (prev - 1 + helpers.length) % helpers.length)
  }

  const goToFullscreenNext = () => {
    setFullscreenIndex((prev) => (prev + 1) % helpers.length)
  }

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeFullscreen()
        } else if (e.key === 'ArrowLeft') {
          goToFullscreenPrevious()
        } else if (e.key === 'ArrowRight') {
          goToFullscreenNext()
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, helpers.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            {
              label: language === "ar" ? "الحماية الشخصية" : "Personal Protection",
              href: "/simple/personal-protect",
            },
            {
              label: language === "ar" ? "الإرشادات" : "Helpers",
              href: "/simple/personal-protect/helpers",
            },
            ...(selectedCategory ? [{
              label: language === "ar" ? selectedCategory.title : selectedCategory.titleEn || selectedCategory.title,
            }] : []),
          ]}
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {language === "ar" ? "الإرشادات" : "Helpers"}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {language === "ar" 
                ? "إرشادات وأدلة مساعدة في الأمن السيبراني" 
                : "Cybersecurity guides and helpful instructions"
              }
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar - Categories */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  {language === "ar" ? "الفئات" : "Categories"}
                </h2>
                
                {categoriesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                          selectedCategoryId === category.id
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                            : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="font-medium">
                          {language === "ar" ? category.title : category.titleEn || category.title}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className={`h-4 w-4 transition-colors duration-300 ${
                            selectedCategoryId === category.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          }`} />
                        ) : (
                          <ArrowRight className={`h-4 w-4 transition-colors duration-300 ${
                            selectedCategoryId === category.id
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {selectedCategoryId ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  {/* Category Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {language === "ar" ? selectedCategory?.title : selectedCategory?.titleEn || selectedCategory?.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {pagination?.itemsCount || 0} {language === "ar" ? "إرشاد" : "helper"}
                      {(pagination?.itemsCount || 0) !== 1 ? (language === "ar" ? "ات" : "s") : ""}
                    </p>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleAutoPlay}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                          isAutoPlay
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {isAutoPlay ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {isAutoPlay 
                            ? (language === "ar" ? "إيقاف التشغيل التلقائي" : "Stop Auto Play")
                            : (language === "ar" ? "تشغيل تلقائي" : "Auto Play")
                          }
                        </span>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentIndex + 1} / {helpers.length}
                      </span>
                    </div>
                  </div>

                  {/* Carousel */}
                  {helpersLoading ? (
                    <div className="relative bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                      </div>
                    </div>
                  ) : helpers.length > 0 ? (
                    <div className="relative">
                      {/* Main Carousel Item */}
                      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl overflow-hidden shadow-xl">
                        <button
                          onClick={() => openFullscreen(currentIndex)}
                          className="group relative w-full h-[500px] overflow-hidden rounded-2xl"
                        >
                          {helpers[currentIndex].imageUrl ? (
                            <img
                              src={getFullImageUrl(helpers[currentIndex].imageUrl)}
                              alt={language === "ar" ? helpers[currentIndex].title : helpers[currentIndex].titleEn || helpers[currentIndex].title}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                              <BookOpen className="h-24 w-24 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          
                          {/* Overlay with content */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                                {language === "ar" ? helpers[currentIndex].title : helpers[currentIndex].titleEn || helpers[currentIndex].title}
                              </h3>
                              <div className="flex items-center gap-2 text-white/80">
                                <Maximize2 className="h-4 w-4" />
                                <span className="text-sm">
                                  {language === "ar" ? "انقر للتكبير" : "Click to enlarge"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Navigation Arrows */}
                        {helpers.length > 1 && (
                          <>
                            <button
                              onClick={goToPrevious}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 group"
                            >
                              <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            </button>
                            <button
                              onClick={goToNext}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 group"
                            >
                              <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {language === "ar" ? "لا توجد إرشادات متاحة" : "No helpers available"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        {language === "ar" 
                          ? "لم يتم العثور على إرشادات في هذه الفئة" 
                          : "No helpers found in this category"
                        }
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <BookOpen className="h-20 w-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {language === "ar" ? "اختر فئة الإرشادات" : "Select a Helper Category"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {language === "ar" 
                      ? "اختر فئة من القائمة الجانبية لعرض الإرشادات المتاحة" 
                      : "Select a category from the sidebar to view available helpers"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-3xl flex items-center justify-center"
          style={{ 
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
        >
          {/* Additional blur layer for better effect */}
          <div 
            className="absolute inset-0 bg-black/10"
            style={{ 
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          ></div>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 group"
            >
              <X className="h-6 w-6 text-white group-hover:text-red-400" />
            </button>

            {/* Image */}
            {helpers[fullscreenIndex]?.imageUrl ? (
              <img
                src={getFullImageUrl(helpers[fullscreenIndex].imageUrl)}
                alt={language === "ar" ? helpers[fullscreenIndex].title : helpers[fullscreenIndex].titleEn || helpers[fullscreenIndex].title}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            ) : (
              <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center rounded-xl">
                <BookOpen className="h-24 w-24 text-blue-600 dark:text-blue-400" />
              </div>
            )}

            {/* Navigation Arrows */}
            {helpers.length > 1 && (
              <>
                <button
                  onClick={goToFullscreenPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 group"
                >
                  <ChevronLeft className="h-8 w-8 text-white group-hover:text-blue-400" />
                </button>
                <button
                  onClick={goToFullscreenNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 group"
                >
                  <ChevronRight className="h-8 w-8 text-white group-hover:text-blue-400" />
                </button>
              </>
            )}

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3">
              <h3 className="text-lg font-semibold text-white text-center">
                {language === "ar" ? helpers[fullscreenIndex]?.title : helpers[fullscreenIndex]?.titleEn || helpers[fullscreenIndex]?.title}
              </h3>
              <p className="text-white/80 text-sm text-center mt-1">
                {fullscreenIndex + 1} / {helpers.length}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
