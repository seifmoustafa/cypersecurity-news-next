"use client"

import { ArrowLeft, BookOpen, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import type { ApiLecture } from "@/core/domain/models/media"

interface LecturePageClientProps {
  lecture: ApiLecture
  categoryId: string
}

export default function LecturePageClient({ lecture, categoryId }: LecturePageClientProps) {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  const getDisplayName = () => {
    return language === "ar" ? lecture.nameAr || lecture.nameEn || "" : lecture.nameEn || lecture.nameAr || ""
  }

  const getDisplaySummary = () => {
    return language === "ar"
      ? lecture.summaryAr || lecture.summaryEn || ""
      : lecture.summaryEn || lecture.summaryAr || ""
  }

  const getDisplayContent = () => {
    return language === "ar"
      ? lecture.contentAr || lecture.contentEn || ""
      : lecture.contentEn || lecture.contentAr || ""
  }

  const getDocumentUrl = () => {
    if (!lecture.documentUrl) return null
    return lecture.documentUrl.startsWith("http")
      ? lecture.documentUrl
      : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""}${lecture.documentUrl}`
  }

  const handleDownload = () => {
    const documentUrl = getDocumentUrl()
    if (documentUrl) {
      const link = document.createElement("a")
      link.href = documentUrl
      // link.download = `${getDisplayName() || "lecture"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const handleBack = () => {
    router.push(`/advanced/lectures/${categoryId}`)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "ar" ? "العودة إلى الفئة" : "Back to Category"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
                <h1 className={`text-4xl font-bold mb-4 ${isRtl ? "text-right" : "text-left"}`}>{getDisplayName()}</h1>

                <div
                  className={`flex items-center gap-4 mb-6 ${isRtl ? "justify-end flex-row-reverse" : "justify-start"}`}
                >
                  {/* <div className={`flex items-center gap-2 text-muted-foreground ${isRtl ? "flex-row-reverse" : ""}`}>
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(lecture.createdAt)}</span>
                  </div> */}
                </div>
              </div>

              {/* Summary */}
              {getDisplaySummary() && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h2 className={`text-xl font-semibold mb-4 ${isRtl ? "text-right" : "text-left"}`}>
                      {language === "ar" ? "الملخص" : "Summary"}
                    </h2>
                    <p className={`text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                      {getDisplaySummary()}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Content */}
              <Card>
                <CardContent className="p-6">
                  <h2 className={`text-xl font-semibold mb-6 ${isRtl ? "text-right" : "text-left"}`}>
                    <BookOpen className="inline-block mr-2 h-5 w-5 text-primary" />
                    {language === "ar" ? "محتوى المحاضرة" : "Lecture Content"}
                  </h2>

                  <div
                    className={`prose prose-lg max-w-none ${isRtl ? "text-right" : "text-left"}`}
                    dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
                    dir={isRtl ? "rtl" : "ltr"}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className={`font-semibold mb-4 ${isRtl ? "text-right" : "text-left"}`}>
                    {language === "ar" ? "معلومات إضافية" : "Additional Information"}
                  </h3>

                  <div className="space-y-4">
                    {/* <div>
                      <p className={`text-sm text-muted-foreground mb-1 ${isRtl ? "text-right" : "text-left"}`}>
                        {language === "ar" ? "تاريخ الإنشاء" : "Created Date"}
                      </p>
                      <p className={`text-sm font-medium ${isRtl ? "text-right" : "text-left"}`}>
                        {formatDate(lecture.createdAt)}
                      </p>
                    </div> */}
{/* 
                    {lecture.updatedAt && (
                      <div>
                        <p className={`text-sm text-muted-foreground mb-1 ${isRtl ? "text-right" : "text-left"}`}>
                          {language === "ar" ? "تاريخ التحديث" : "Updated Date"}
                        </p>
                        <p className={`text-sm font-medium ${isRtl ? "text-right" : "text-left"}`}>
                          {formatDate(lecture.updatedAt)}
                        </p>
                      </div>
                    )} */}

                    {lecture.documentUrl && (
                      <div className="pt-4 border-t">
                        <Button onClick={handleDownload} className={`w-full ${isRtl ? "flex-row-reverse" : ""}`}>
                          <Download className="h-4 w-4 mr-2" />
                          {language === "ar" ? "تحميل" : "Download"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}