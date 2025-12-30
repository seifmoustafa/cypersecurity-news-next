"use client"

import { use, useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Instruction } from "@/core/domain/models/instruction"
import type { InstructionCategory } from "@/core/domain/models/instruction-category"
import type { InstructionYear } from "@/core/domain/models/instruction-year"
import { FileText, Calendar, Share2, Eye, TrendingUp, Download } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"

interface InstructionDetailPageProps {
      params: Promise<{
            categoryId: string
            yearId: string
            id: string
      }>
}

export default function InstructionDetailPage({ params }: InstructionDetailPageProps) {
      const { language, isRtl } = useLanguage()
      const resolvedParams = use(params)

      const [instruction, setInstruction] = useState<Instruction | null>(null)
      const [category, setCategory] = useState<InstructionCategory | null>(null)
      const [yearData, setYearData] = useState<InstructionYear | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [isDownloading, setIsDownloading] = useState(false)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)

                        // Fetch instruction
                        const instructionData = await container.services.instructions.getInstructionById(resolvedParams.id)
                        setInstruction(instructionData)

                        // Fetch category for breadcrumbs
                        const categoryData = await container.services.instructionCategories.getCategoryById(resolvedParams.categoryId)
                        setCategory(categoryData)

                        // Fetch year for breadcrumbs
                        const year = await container.services.instructionYears.getYearById(resolvedParams.yearId)
                        setYearData(year)
                  } catch (err) {
                        console.error("❌ Error fetching instruction:", err)
                        setError(language === "ar" ? "حدث خطأ في تحميل التعليمة" : "Error loading instruction")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.id, resolvedParams.categoryId, resolvedParams.yearId, language])

      const handleDownload = async (documentUrl: string, title: string) => {
            if (documentUrl) {
                  setIsDownloading(true)
                  try {
                        const link = document.createElement("a")
                        link.href = documentUrl
                        link.download = `${title}.pdf`
                        link.target = "_blank"
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                  } catch (error) {
                        console.error("Download failed:", error)
                  } finally {
                        setIsDownloading(false)
                  }
            }
      }

      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category" },
                                    { label: "..." },
                                    { label: "..." },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="space-y-4">
                                          {[...Array(6)].map((_, i) => (
                                                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </div>
            )
      }

      if (error || !instruction) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />

                              <div className="max-w-4xl mx-auto text-center py-16">
                                    <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                          <FileText className="h-12 w-12 text-red-500" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                          {language === "ar" ? "التعليمة غير موجودة" : "Instruction Not Found"}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                          {error || (language === "ar" ? "عذراً، التعليمة المطلوبة غير متاحة" : "Sorry, the requested instruction is not available")}
                                    </p>
                              </div>
                        </div>
                  </div>
            )
      }

      const title = language === "ar" ? instruction.title : (instruction.titleEn || instruction.title)
      const content = language === "ar" ? instruction.content : (instruction.contentEn || instruction.content)
      const summary = language === "ar" ? instruction.summary : (instruction.summaryEn || instruction.summary)

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs: Home > Instructions > [Category] > [Year] > [Instruction] */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "التعليمات" : "Instructions", href: "/advanced/instructions/category" },
                              { label: categoryName, href: `/advanced/instructions/category/${resolvedParams.categoryId}` },
                              { label: yearData?.year?.toString() || "", href: `/advanced/instructions/category/${resolvedParams.categoryId}/year/${resolvedParams.yearId}` },
                              { label: title || "" }
                        ]} />

                        {/* Article Container */}
                        <article className="max-w-5xl mx-auto mt-6">
                              <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700 overflow-hidden shadow-2xl">
                                    {/* Header Section */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 md:p-12">
                                          <div className="flex items-start gap-6">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                                                      <FileText className="h-8 w-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-2">
                                                                  <Calendar className="h-4 w-4 text-white" />
                                                                  <span className="text-sm font-medium text-white">{yearData?.year}</span>
                                                            </div>

                                                            {/* Download Button in Header */}
                                                            {instruction.documentUrl && (
                                                                  <Button
                                                                        onClick={() => handleDownload(instruction.documentUrl!, title || "document")}
                                                                        disabled={isDownloading}
                                                                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                                                                  >
                                                                        <Download className={`h-4 w-4 mr-2 ${isDownloading ? "animate-bounce" : ""}`} />
                                                                        {isDownloading
                                                                              ? (language === "ar" ? "جاري التحميل..." : "Downloading...")
                                                                              : (language === "ar" ? "تحميل المستند" : "Download Document")}
                                                                  </Button>
                                                            )}
                                                      </div>
                                                      <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                                            {title}
                                                      </h1>
                                                </div>
                                          </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 md:p-12">
                                          {/* Summary */}
                                          {summary && (
                                                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-l-4 border-blue-600 p-6 mb-10 rounded-r-2xl">
                                                      <div className="flex items-start gap-3">
                                                            <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                                            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                                                                  {summary.replace(/<[^>]*>/g, '')}
                                                            </p>
                                                      </div>
                                                </div>
                                          )}

                                          {/* Article Content */}
                                          <div
                                                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-p:text-gray-700 dark:prose-p:text-gray-300
                  prose-a:text-blue-600 dark:prose-a:text-blue-400
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                  prose-ol:text-gray-700 dark:prose-ol:text-gray-300"
                                                dangerouslySetInnerHTML={{ __html: content || "" }}
                                          />

                                          {/* Document Download Section */}
                                          {instruction.documentUrl && (
                                                <div className="mt-10 p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                                      <div className="flex items-center justify-between flex-wrap gap-4">
                                                            <div className="flex items-center gap-3">
                                                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                                                        <FileText className="h-6 w-6 text-white" />
                                                                  </div>
                                                                  <div>
                                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                                              {language === "ar" ? "مستند التعليمة" : "Instruction Document"}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                              {language === "ar" ? "تحميل المستند كاملاً بصيغة PDF" : "Download full document as PDF"}
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                            <Button
                                                                  onClick={() => handleDownload(instruction.documentUrl!, title || "document")}
                                                                  disabled={isDownloading}
                                                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                                            >
                                                                  <Download className={`h-4 w-4 mr-2 ${isDownloading ? "animate-bounce" : ""}`} />
                                                                  {isDownloading
                                                                        ? (language === "ar" ? "جاري التحميل..." : "Downloading...")
                                                                        : (language === "ar" ? "تحميل" : "Download")}
                                                            </Button>
                                                      </div>
                                                </div>
                                          )}

                                          {/* Share Section */}
                                          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <Eye className="h-5 w-5" />
                                                            <span className="text-sm">
                                                                  {language === "ar" ? "شارك هذه التعليمة مع الآخرين" : "Share this instruction with others"}
                                                            </span>
                                                      </div>

                                                      <button
                                                            onClick={() => {
                                                                  if (navigator.share) {
                                                                        navigator.share({
                                                                              title: title || "",
                                                                              text: summary?.replace(/<[^>]*>/g, '') || "",
                                                                              url: window.location.href
                                                                        })
                                                                  }
                                                            }}
                                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                                                      >
                                                            <Share2 className="h-4 w-4" />
                                                            {language === "ar" ? "مشاركة" : "Share"}
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </article>
                  </div>
            </div>
      )
}
