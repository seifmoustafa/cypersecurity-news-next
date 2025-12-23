"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Download, FileText, BookOpen, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { container } from "@/core/di/container"
import MainLayout from "@/components/layouts/main-layout"

interface AwarenessDetailPageClientProps {
  year: string
  id: string
}

export default function AwarenessDetailPageClient({ year, id }: AwarenessDetailPageClientProps) {
  const router = useRouter()
  const [awareness, setAwareness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Safe language context usage with fallback values
  const languageContext = useLanguage()
  let language = "ar"
  let isRtl = true

  try {
    language = languageContext.language
    isRtl = languageContext.isRtl
  } catch (e) {
    console.error("Language context not available, using fallback values")
  }

  useEffect(() => {
    const fetchAwareness = async () => {
      try {
        setLoading(true)

        const foundAwareness = await container.services.awareness.getAwarenessById(id)

        if (foundAwareness) {
          setAwareness(foundAwareness)
        } else {
          setError("Content not found")
        }
      } catch (err) {
        setError("Error loading content")
        console.error("Error fetching awareness:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAwareness()
  }, [id])

  const getDisplayTitle = (item: any) => {
    return language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""
  }

  const getDisplayContent = (item: any) => {
    return language === "ar" ? item.content || item.contentEn || "" : item.contentEn || item.content || ""
  }

  const getDisplaySummary = (item: any) => {
    return language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""
  }

  const handleDownload = async (documentUrl: string, title: string) => {
    if (documentUrl) {
      setIsDownloading(true)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
        const fullUrl = `${documentUrl}`

        // Create a temporary link and trigger download
        const link = document.createElement("a")
        link.href = fullUrl
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

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Loading Skeleton */}
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <Card className="dark:bg-slate-900 dark:border-slate-800">
                <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-8 space-y-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !awareness) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 dark:bg-slate-900 dark:border-slate-800">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                {language === "ar" ? "المحتوى غير موجود" : "Content Not Found"}
              </h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => router.push(`/advanced/awareness/${year}`)}>
                {language === "ar" ? "العودة" : "Go Back"}
              </Button>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/advanced/awareness/${year}`)}
            className="group flex items-center gap-2 hover:bg-accent dark:hover:bg-slate-800 rounded-lg px-4 py-2 transition-all duration-200"
          >
            {isRtl ? (
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            )}
            <span className="font-medium">{language === "ar" ? `العودة لعام ${year}` : `Back to ${year}`}</span>
          </Button>
        </div>

        {/* Enhanced Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg dark:bg-slate-900 dark:border-slate-800">
            {/* Enhanced Header */}
            <CardHeader className="relative bg-primary dark:bg-slate-800 text-primary-foreground p-0">
              {/* Header Content */}
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Icon Section */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 dark:bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Shield className="h-10 w-10 md:h-12 md:w-12 text-white" />
                      </div>
                      {awareness.isActive && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title and Meta Section */}
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge className="bg-white/20 dark:bg-white/5 text-white border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10">
                        {language === "ar" ? `عام ${awareness.year || year}` : `Year ${awareness.year || year}`}
                      </Badge>
                      <Badge
                        variant={awareness.isActive ? "default" : "secondary"}
                        className={
                          awareness.isActive
                            ? "bg-green-500/30 dark:bg-green-500/10 text-green-100 border-green-400/50 dark:border-green-400/20"
                            : "bg-gray-500/30 dark:bg-gray-500/10 text-gray-100 border-gray-400/50 dark:border-gray-400/20"
                        }
                      >
                        {awareness.isActive
                          ? language === "ar"
                            ? "نشط"
                            : "Active"
                          : language === "ar"
                            ? "غير نشط"
                            : "Inactive"}
                      </Badge>
                      <Badge className="bg-white/20 dark:bg-white/5 text-white border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {language === "ar" ? "توعية أمنية" : "Security Awareness"}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                      {getDisplayTitle(awareness)}
                    </h1>

                    {/* Summary */}
                    {getDisplaySummary(awareness) && (
                      <p className="text-blue-100 dark:text-slate-300 text-lg mb-6 leading-relaxed">
                        {getDisplaySummary(awareness)}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      {awareness.documentUrl && (
                        <Button
                          onClick={() => handleDownload(awareness.documentUrl, getDisplayTitle(awareness))}
                          disabled={isDownloading}
                          className="bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 text-white border border-white/30 dark:border-white/10 backdrop-blur-sm transition-all duration-200"
                        >
                          <Download className={`h-4 w-4 mr-2 ${isDownloading ? "animate-bounce" : ""}`} />
                          {isDownloading
                            ? language === "ar"
                              ? "جاري التحميل..."
                              : "Downloading..."
                            : language === "ar"
                              ? "تحميل المستند"
                              : "Download Document"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 md:p-12 dark:bg-slate-900">
              {/* Only show document type if document exists */}
              {awareness.documentUrl && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 p-4 bg-accent/50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-700 max-w-sm">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-slate-500">
                        {language === "ar" ? "نوع المستند" : "Document Type"}
                      </p>
                      <p className="font-semibold dark:text-slate-200">PDF</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-8 dark:bg-slate-700" />

              {/* Enhanced Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:dark:text-slate-200 prose-p:dark:text-slate-400 prose-strong:dark:text-slate-200 prose-a:dark:text-blue-400">
                <div
                  className={`leading-relaxed text-foreground dark:text-slate-400 ${isRtl ? "text-right" : "text-left"}`}
                  dangerouslySetInnerHTML={{ __html: getDisplayContent(awareness) }}
                />
              </div>

              {/* Enhanced Download Section */}
              {awareness.documentUrl && (
                <div className="mt-12">
                  <Separator className="mb-8 dark:bg-slate-700" />
                  <Card className="bg-accent/30 dark:bg-slate-800/30 border-primary/20 dark:border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-primary/10 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <FileText className="h-8 w-8 text-primary dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1 dark:text-slate-200">
                              {language === "ar" ? "مستند التوعية الأمنية" : "Security Awareness Document"}
                            </h3>
                            <p className="text-muted-foreground dark:text-slate-500">
                              {language === "ar"
                                ? "تحميل المستند كاملاً بصيغة PDF للاطلاع عليه لاحقاً"
                                : "Download the complete document as PDF for offline reading"}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(awareness.documentUrl, getDisplayTitle(awareness))}
                          disabled={isDownloading}
                          size="lg"
                          className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          <Download className={`h-5 w-5 mr-2 ${isDownloading ? "animate-bounce" : ""}`} />
                          {isDownloading
                            ? language === "ar"
                              ? "جاري التحميل..."
                              : "Downloading..."
                            : language === "ar"
                              ? "تحميل"
                              : "Download"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Simple back to content button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={() => router.push(`/advanced/awareness/${year}`)}
                  variant="outline"
                  className="hover:bg-accent dark:hover:bg-slate-800 dark:border-slate-700"
                >
                  {language === "ar" ? "عرض المزيد من المحتوى" : "View More Content"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
