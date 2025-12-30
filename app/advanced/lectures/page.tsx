"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { LectureCategory } from "@/core/domain/models/media"
import { BookOpen, ArrowRight, ArrowLeft, Search, X, Folder } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import Image from "next/image"

export default function LecturesPage() {
      const router = useRouter()
      const { language, isRtl } = useLanguage()
      const [categories, setCategories] = useState<LectureCategory[]>([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [searchQuery, setSearchQuery] = useState("")
      const debouncedSearch = useDebounce(searchQuery, 500)

      useEffect(() => {
            const fetchCategories = async () => {
                  try {
                        setLoading(true)
                        setError(null)
                        const response = await container.services.media.getLectureCategoriesForProfessionals(1, 100, debouncedSearch)
                        setCategories(response.data)
                  } catch (err) {
                        console.error("Error fetching categories:", err)
                        setError(language === "ar" ? "حدث خطأ في تحميل الفئات" : "Error loading categories")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchCategories()
      }, [debouncedSearch, language])

      const handleCategoryClick = (categoryId: string) => {
            router.push(`/advanced/lectures/${categoryId}`)
      }

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "المحاضرات" : "Lectures" }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {Array.from({ length: 6 }).map((_, i) => (
                                                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      if (error) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "المحاضرات" : "Lectures" }
                              ]} />
                              <div className="text-center py-16">
                                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">{error}</p>
                                    <Button onClick={() => window.location.reload()} className="mt-4">
                                          {language === "ar" ? "إعادة المحاولة" : "Retry"}
                                    </Button>
                              </div>
                        </div>
                  </div>
            )
      }

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                              { label: language === "ar" ? "المحاضرات" : "Lectures" }
                        ]} />

                        {/* Page Header */}
                        <div className="mt-8 mb-8 text-center">
                              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg shadow-emerald-500/30">
                                    <BookOpen className="h-10 w-10 text-white" />
                              </div>
                              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {language === "ar" ? "مكتبة المحاضرات" : "Lecture Library"}
                              </h1>
                              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    {language === "ar"
                                          ? "اختر فئة لقراءة المحاضرات المتاحة"
                                          : "Choose a category to read available lectures"}
                              </p>
                        </div>

                        {/* Search Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8 max-w-2xl mx-auto">
                              <div className="flex items-center gap-4" dir={isRtl ? "rtl" : "ltr"}>
                                    <div className="relative flex-1">
                                          <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRtl ? "right-3" : "left-3"}`} />
                                          <input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={language === "ar" ? "ابحث في الفئات..." : "Search categories..."}
                                                className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white`}
                                          />
                                          {searchQuery && (
                                                <button
                                                      onClick={() => setSearchQuery("")}
                                                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRtl ? "left-3" : "right-3"}`}
                                                >
                                                      <X className="h-5 w-5" />
                                                </button>
                                          )}
                                    </div>
                              </div>
                        </div>

                        {/* Categories Grid */}
                        {categories.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir={isRtl ? "rtl" : "ltr"}>
                                    {categories.map((category, index) => (
                                          <button
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category.id)}
                                                className="group w-full text-left"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                          >
                                                <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02] h-full overflow-hidden">
                                                      {/* Category Image */}
                                                      <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-teal-600">
                                                            {category.imageUrl ? (
                                                                  <Image
                                                                        src={category.imageUrl}
                                                                        alt={language === "ar" ? category.name : category.nameEn || category.name}
                                                                        fill
                                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                  />
                                                            ) : (
                                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                                                                              <Folder className="h-12 w-12 text-white" />
                                                                        </div>
                                                                  </div>
                                                            )}

                                                            {/* Overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                                            {/* Category Icon */}
                                                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                                  <BookOpen className="h-5 w-5 text-white" />
                                                            </div>
                                                      </div>

                                                      {/* Content */}
                                                      <div className="p-6">
                                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                                                                  {language === "ar" ? category.name : category.nameEn || category.name}
                                                            </h3>

                                                            <div className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium mt-2 group-hover:gap-2 transition-all duration-300">
                                                                  <span className={isRtl ? "ml-1" : "mr-1"}>
                                                                        {language === "ar" ? "عرض المحاضرات" : "View Lectures"}
                                                                  </span>
                                                                  {isRtl ? (
                                                                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                                                  ) : (
                                                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                                  )}
                                                            </div>
                                                      </div>
                                                </div>
                                          </button>
                                    ))}
                              </div>
                        ) : (
                              <div className="text-center py-16">
                                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {debouncedSearch
                                                ? (language === "ar" ? "لا توجد فئات تطابق البحث" : "No categories match your search")
                                                : (language === "ar" ? "لا توجد فئات متاحة" : "No categories available")}
                                    </p>
                              </div>
                        )}
                  </div>
            </div>
      )
}
