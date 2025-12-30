"use client"

import { useEffect, useState, use } from "react"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Definition, DefinitionCategory } from "@/core/domain/models/definition"
import { BookOpen, Share2, ArrowLeft, ArrowRight } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DefinitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
      const resolvedParams = use(params)
      const { language, isRtl } = useLanguage()
      const [definition, setDefinition] = useState<Definition | null>(null)
      const [category, setCategory] = useState<DefinitionCategory | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        setError(null)

                        // Fetch definition details
                        const def = await container.services.definitions.getDefinitionById(resolvedParams.id)
                        if (!def) {
                              setError(language === "ar" ? "التعريف غير موجود" : "Definition not found")
                              return
                        }
                        setDefinition(def)

                        // Fetch category details if categoryId exists
                        if (def.categoryId) {
                              const cat = await container.services.definitions.getCategoryById(def.categoryId)
                              setCategory(cat)
                        }
                  } catch (error) {
                        console.error("❌ Error fetching definition:", error)
                        setError(language === "ar" ? "حدث خطأ في تحميل التعريف" : "Error loading definition")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.id, language])

      const handleShare = async () => {
            if (navigator.share && definition) {
                  try {
                        await navigator.share({
                              title: language === "ar" ? (definition.term || definition.termEn) : (definition.termEn || definition.term),
                              url: window.location.href,
                        })
                  } catch (err) {
                        console.log("Share cancelled")
                  }
            } else {
                  navigator.clipboard.writeText(window.location.href)
            }
      }

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "التعريفات" : "Definitions", href: "/advanced/definitions" },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                    <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
                              </div>
                        </div>
                  </div>
            )
      }

      if (error || !definition) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "التعريفات" : "Definitions", href: "/advanced/definitions" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />
                              <div className="text-center py-16">
                                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {error || (language === "ar" ? "التعريف غير موجود" : "Definition not found")}
                                    </p>
                                    <Link href="/advanced/definitions">
                                          <Button className="mt-4">
                                                {language === "ar" ? "العودة إلى التعريفات" : "Back to Definitions"}
                                          </Button>
                                    </Link>
                              </div>
                        </div>
                  </div>
            )
      }

      const term = language === "ar" ? (definition.term || definition.termEn) : (definition.termEn || definition.term)
      const text = language === "ar" ? (definition.definitionText || definition.definitionEn) : (definition.definitionEn || definition.definitionText)
      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs: Home > Definitions > Category > Term */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "التعريفات" : "Definitions", href: "/advanced/definitions" },
                              ...(category ? [{
                                    label: categoryName,
                                    href: `/advanced/definitions/category/${category.id}`
                              }] : []),
                              { label: term || "" }
                        ]} />

                        {/* Main Content */}
                        <div className="mt-8 max-w-4xl mx-auto">
                              {/* Header Card */}
                              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 mb-8 shadow-2xl shadow-blue-500/20">
                                    <div className="flex items-start justify-between gap-4">
                                          <div className="flex-1">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
                                                      <BookOpen className="h-4 w-4" />
                                                      <span>{categoryName || (language === "ar" ? "تعريف" : "Definition")}</span>
                                                </div>

                                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                                      {term}
                                                </h1>

                                                {definition.source && (
                                                      <p className="text-blue-100 text-sm">
                                                            {language === "ar" ? "المصدر: " : "Source: "}{definition.source}
                                                      </p>
                                                )}
                                          </div>

                                          <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={handleShare}
                                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                                          >
                                                <Share2 className="h-5 w-5" />
                                          </Button>
                                    </div>
                              </div>

                              {/* Definition Content */}
                              <div className="bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 p-8 md:p-10">
                                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                          {language === "ar" ? "التعريف" : "Definition"}
                                    </h2>

                                    <div
                                          className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                                          dangerouslySetInnerHTML={{ __html: text || "" }}
                                    />
                              </div>

                              {/* Navigation */}
                              <div className="mt-8 flex justify-center">
                                    <Link href={category ? `/advanced/definitions/category/${category.id}` : "/advanced/definitions"}>
                                          <Button variant="outline" className="gap-2">
                                                {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                                                {language === "ar" ? "العودة إلى الفئة" : "Back to Category"}
                                          </Button>
                                    </Link>
                              </div>
                        </div>
                  </div>
            </div>
      )
}
