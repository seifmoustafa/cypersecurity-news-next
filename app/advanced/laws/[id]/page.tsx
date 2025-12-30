"use client"

import { useEffect, useState, use } from "react"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Law } from "@/core/domain/models/law"
import type { LawCategory } from "@/core/domain/models/law-category"
import { Scale, Share2, ArrowLeft, ArrowRight, Calendar, Download, FileText } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LawDetailPage({ params }: { params: Promise<{ id: string }> }) {
      const resolvedParams = use(params)
      const { language, isRtl } = useLanguage()
      const [law, setLaw] = useState<Law | null>(null)
      const [category, setCategory] = useState<LawCategory | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [downloading, setDownloading] = useState(false)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        setError(null)

                        // Fetch law details
                        const lawData = await container.services.laws.getLawById(resolvedParams.id)
                        if (!lawData) {
                              setError(language === "ar" ? "القانون غير موجود" : "Law not found")
                              return
                        }
                        setLaw(lawData)

                        // Fetch category details if categoryId exists
                        if (lawData.categoryId) {
                              const cat = await container.services.laws.getCategoryById(lawData.categoryId)
                              setCategory(cat)
                        }
                  } catch (error) {
                        console.error("❌ Error fetching law:", error)
                        setError(language === "ar" ? "حدث خطأ في تحميل القانون" : "Error loading law")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.id, language])

      const handleShare = async () => {
            if (navigator.share && law) {
                  try {
                        await navigator.share({
                              title: language === "ar" ? (law.title || law.titleEn) : (law.titleEn || law.title),
                              url: window.location.href,
                        })
                  } catch (err) {
                        console.log("Share cancelled")
                  }
            } else {
                  navigator.clipboard.writeText(window.location.href)
            }
      }

      const handleDownload = async () => {
            if (!law?.documentUrl) return

            setDownloading(true)
            try {
                  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
                  const fullUrl = `${baseUrl}${law.documentUrl}`

                  const response = await fetch(fullUrl)
                  const blob = await response.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = law.documentUrl.split("/").pop() || "document.pdf"
                  document.body.appendChild(a)
                  a.click()
                  window.URL.revokeObjectURL(url)
                  document.body.removeChild(a)
            } catch (error) {
                  console.error("Download failed:", error)
            } finally {
                  setDownloading(false)
            }
      }

      const formatDate = (dateStr: string | null) => {
            if (!dateStr) return null
            try {
                  const date = new Date(dateStr)
                  return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                  })
            } catch {
                  return null
            }
      }

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "القوانين" : "Laws", href: "/advanced/laws" },
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

      if (error || !law) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "القوانين" : "Laws", href: "/advanced/laws" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />
                              <div className="text-center py-16">
                                    <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {error || (language === "ar" ? "القانون غير موجود" : "Law not found")}
                                    </p>
                                    <Link href="/advanced/laws">
                                          <Button className="mt-4">
                                                {language === "ar" ? "العودة إلى القوانين" : "Back to Laws"}
                                          </Button>
                                    </Link>
                              </div>
                        </div>
                  </div>
            )
      }

      const title = language === "ar" ? (law.title || law.titleEn) : (law.titleEn || law.title)
      const content = language === "ar" ? (law.content || law.contentEn) : (law.contentEn || law.content)
      const summary = language === "ar" ? (law.summary || law.summaryEn) : (law.summaryEn || law.summary)
      const categoryName = category ? (language === "ar" ? category.name : (category.nameEn || category.name)) : ""

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "القوانين" : "Laws", href: "/advanced/laws" },
                              ...(category ? [{
                                    label: categoryName,
                                    href: `/advanced/laws/category/${category.id}`
                              }] : []),
                              { label: title || "" }
                        ]} />

                        {/* Main Content */}
                        <div className="mt-8 max-w-4xl mx-auto">
                              {/* Header Card */}
                              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 mb-8 shadow-2xl shadow-blue-500/20">
                                    <div className="flex items-start justify-between gap-4">
                                          <div className="flex-1">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
                                                      <Scale className="h-4 w-4" />
                                                      <span>{categoryName || (language === "ar" ? "قانون" : "Law")}</span>
                                                </div>

                                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                                      {title}
                                                </h1>

                                                {/* Dates */}
                                                {/* <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                                                      {law.issueDate && (
                                                            <div className="flex items-center gap-1.5">
                                                                  <Calendar className="h-4 w-4" />
                                                                  <span>{language === "ar" ? "تاريخ الإصدار: " : "Issue Date: "}{formatDate(law.issueDate)}</span>
                                                            </div>
                                                      )}
                                                      {law.effectiveDate && (
                                                            <div className="flex items-center gap-1.5">
                                                                  <Calendar className="h-4 w-4" />
                                                                  <span>{language === "ar" ? "تاريخ النفاذ: " : "Effective: "}{formatDate(law.effectiveDate)}</span>
                                                            </div>
                                                      )}
                                                </div> */}
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

                              {/* Summary */}
                              {summary && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-200/50 dark:border-blue-800/50">
                                          <h2 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                {language === "ar" ? "ملخص" : "Summary"}
                                          </h2>
                                          <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                                                {summary}
                                          </p>
                                    </div>
                              )}

                              {/* Content */}
                              <div className="bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 p-8 md:p-10 mb-8">
                                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                          <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                          {language === "ar" ? "نص القانون" : "Law Content"}
                                    </h2>

                                    <div
                                          className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                                          dangerouslySetInnerHTML={{ __html: content || "" }}
                                    />
                              </div>

                              {/* Document Download */}
                              {law.documentUrl && (
                                    <div className="bg-white/10 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700 p-6 mb-8">
                                          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                {language === "ar" ? "تحميل المستند" : "Download Document"}
                                          </h2>
                                          <Button
                                                onClick={handleDownload}
                                                disabled={downloading}
                                                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                          >
                                                <Download className="h-4 w-4" />
                                                {downloading
                                                      ? (language === "ar" ? "جاري التحميل..." : "Downloading...")
                                                      : (language === "ar" ? "تحميل PDF" : "Download PDF")}
                                          </Button>
                                    </div>
                              )}

                              {/* Navigation */}
                              <div className="flex justify-center">
                                    <Link href={category ? `/advanced/laws/category/${category.id}` : "/advanced/laws"}>
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
