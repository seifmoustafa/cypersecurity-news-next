"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { Regulation } from "@/core/domain/models/regulation"
import type { RegulationCategory } from "@/core/domain/models/regulation-category"
import { FileText, Share2, ArrowLeft, ArrowRight, Download } from "lucide-react"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RegulationDetailPage({ params }: { params: Promise<{ id: string }> }) {
      const resolvedParams = use(params)
      const { language, isRtl } = useLanguage()
      const [regulation, setRegulation] = useState<Regulation | null>(null)
      const [category, setCategory] = useState<RegulationCategory | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [downloading, setDownloading] = useState(false)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        setError(null)

                        // Fetch regulation details
                        const regData = await container.services.regulations.getRegulationById(resolvedParams.id)
                        if (!regData) {
                              setError(language === "ar" ? "اللائحة غير موجودة" : "Regulation not found")
                              return
                        }
                        setRegulation(regData)

                        // Fetch category details if regulationCategoryId exists
                        if (regData.regulationCategoryId) {
                              const cat = await container.services.regulationCategories.getCategoryById(regData.regulationCategoryId)
                              setCategory(cat)
                        }
                  } catch (error) {
                        console.error("❌ Error fetching regulation:", error)
                        setError(language === "ar" ? "حدث خطأ في تحميل اللائحة" : "Error loading regulation")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.id, language])

      const handleShare = async () => {
            if (navigator.share && regulation) {
                  try {
                        await navigator.share({
                              title: language === "ar" ? (regulation.title || regulation.titleEn) : (regulation.titleEn || regulation.title),
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
            if (!regulation?.documentUrl) return

            setDownloading(true)
            try {
                  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
                  const fullUrl = `${baseUrl}${regulation.documentUrl}`

                  const response = await fetch(fullUrl)
                  const blob = await response.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = regulation.documentUrl.split("/").pop() || "document.pdf"
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

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "اللوائح" : "Regulations", href: "/advanced/regulations" },
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

      if (error || !regulation) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "اللوائح" : "Regulations", href: "/advanced/regulations" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />
                              <div className="text-center py-16">
                                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {error || (language === "ar" ? "اللائحة غير موجودة" : "Regulation not found")}
                                    </p>
                                    <Link href="/advanced/regulations">
                                          <Button className="mt-4">
                                                {language === "ar" ? "العودة إلى اللوائح" : "Back to Regulations"}
                                          </Button>
                                    </Link>
                              </div>
                        </div>
                  </div>
            )
      }

      const title = language === "ar" ? (regulation.title || regulation.titleEn) : (regulation.titleEn || regulation.title)
      const content = language === "ar" ? (regulation.content || regulation.contentEn) : (regulation.contentEn || regulation.content)
      const summary = language === "ar" ? (regulation.summary || regulation.summaryEn) : (regulation.summaryEn || regulation.summary)
      const categoryName = category ? (language === "ar" ? category.name : (category.name_En || category.name)) : ""
      // Use the imageUrl from repository (already transformed) - validate it's a proper URL
      const imageUrl = regulation.imageUrl && regulation.imageUrl.startsWith("http") ? regulation.imageUrl : null

      return (
            <div className="min-h-screen">
                  <div className="container mx-auto px-4 pt-8 pb-16">
                        {/* Breadcrumbs */}
                        <AdvancedBreadcrumbs items={[
                              { label: language === "ar" ? "اللوائح" : "Regulations", href: "/advanced/regulations" },
                              ...(category ? [{
                                    label: categoryName,
                                    href: `/advanced/regulations/category/${category.id}`
                              }] : []),
                              { label: title || "" }
                        ]} />

                        {/* Main Content */}
                        <div className="mt-8 max-w-4xl mx-auto">
                              {/* Header Card with Image */}
                              <div className="rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-blue-500/20">
                                    {/* Image Section */}
                                    {imageUrl ? (
                                          <div className="relative h-64 md:h-80">
                                                <Image
                                                      src={imageUrl}
                                                      alt={title}
                                                      fill
                                                      className="object-contain bg-slate-100 dark:bg-slate-900"
                                                />
                                                {/* Subtle bottom gradient for text readability */}
                                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

                                                {/* Share button */}
                                                <Button
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={handleShare}
                                                      className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/80 dark:bg-slate-800/80 border-white/20 text-gray-700 dark:text-white hover:bg-white hover:text-gray-900"
                                                >
                                                      <Share2 className="h-5 w-5" />
                                                </Button>

                                                {/* Title overlay on image */}
                                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-white text-sm mb-3">
                                                            <FileText className="h-4 w-4" />
                                                            <span>{categoryName || (language === "ar" ? "لائحة" : "Regulation")}</span>
                                                      </div>
                                                      <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                                                            {title}
                                                      </h1>
                                                </div>
                                          </div>
                                    ) : (
                                          /* No image - use gradient header */
                                          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-10">
                                                <div className="flex items-start justify-between gap-4">
                                                      <div className="flex-1">
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
                                                                  <FileText className="h-4 w-4" />
                                                                  <span>{categoryName || (language === "ar" ? "لائحة" : "Regulation")}</span>
                                                            </div>
                                                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                                                  {title}
                                                            </h1>
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
                                    )}
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
                                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                          {language === "ar" ? "نص اللائحة" : "Regulation Content"}
                                    </h2>

                                    <div
                                          className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                                          dangerouslySetInnerHTML={{ __html: content || "" }}
                                    />
                              </div>

                              {/* Document Download */}
                              {regulation.documentUrl && (
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
                                    <Link href={category ? `/advanced/regulations/category/${category.id}` : "/advanced/regulations"}>
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
