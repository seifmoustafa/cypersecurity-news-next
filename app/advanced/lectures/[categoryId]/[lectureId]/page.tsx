"use client"

import { useEffect, useState, use } from "react"
import { BookOpen, Download, ArrowLeft, ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"
import type { ApiLecture, LectureCategory } from "@/core/domain/models/media"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import Link from "next/link"

export default function LectureDetailPage({
      params
}: {
      params: Promise<{ categoryId: string; lectureId: string }>
}) {
      const resolvedParams = use(params)
      const { language, isRtl } = useLanguage()
      const [lecture, setLecture] = useState<ApiLecture | null>(null)
      const [category, setCategory] = useState<LectureCategory | null>(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        setLoading(true)
                        setError(null)

                        // Fetch lecture
                        const lectureData = await container.services.media.getApiLectureById(resolvedParams.lectureId)
                        setLecture(lectureData)

                        // Fetch category
                        const categoriesResponse = await container.services.media.getLectureCategoriesForProfessionals(1, 100)
                        const foundCategory = categoriesResponse.data.find((cat: LectureCategory) => cat.id === resolvedParams.categoryId)
                        if (foundCategory) {
                              setCategory(foundCategory)
                        }
                  } catch (err) {
                        console.error("Error fetching lecture:", err)
                        setError(language === "ar" ? "حدث خطأ في تحميل المحاضرة" : "Error loading lecture")
                  } finally {
                        setLoading(false)
                  }
            }
            fetchData()
      }, [resolvedParams.categoryId, resolvedParams.lectureId, language])

      const getDocumentUrl = () => {
            if (!lecture?.documentUrl) return null
            return lecture.documentUrl.startsWith("http")
                  ? lecture.documentUrl
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""}${lecture.documentUrl}`
      }

      const handleDownload = () => {
            const documentUrl = getDocumentUrl()
            if (documentUrl) {
                  const link = document.createElement("a")
                  link.href = documentUrl
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
            }
      }

      const categoryName = category
            ? (language === "ar" ? category.name : category.nameEn || category.name)
            : (language === "ar" ? "المحاضرات" : "Lectures")

      const lectureName = lecture
            ? (language === "ar" ? lecture.nameAr : lecture.nameEn || lecture.nameAr)
            : "..."

      if (loading) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "المحاضرات" : "Lectures", href: "/advanced/lectures" },
                                    { label: categoryName, href: `/advanced/lectures/${resolvedParams.categoryId}` },
                                    { label: "..." }
                              ]} />
                              <div className="animate-pulse space-y-8 mt-8">
                                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                                    <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
                              </div>
                        </div>
                  </div>
            )
      }

      if (error || !lecture) {
            return (
                  <div className="min-h-screen">
                        <div className="container mx-auto px-4 pt-8 pb-16">
                              <AdvancedBreadcrumbs items={[
                                    { label: language === "ar" ? "المكتبة" : "Media", href: "/advanced#media" },
                                    { label: language === "ar" ? "المحاضرات" : "Lectures", href: "/advanced/lectures" },
                                    { label: language === "ar" ? "خطأ" : "Error" }
                              ]} />
                              <div className="text-center py-16">
                                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-xl text-gray-600 dark:text-gray-400">
                                          {error || (language === "ar" ? "المحاضرة غير موجودة" : "Lecture not found")}
                                    </p>
                                    <Link href={`/advanced/lectures/${resolvedParams.categoryId}`}>
                                          <Button className="mt-4">
                                                {language === "ar" ? "العودة للمحاضرات" : "Back to Lectures"}
                                          </Button>
                                    </Link>
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
                              { label: language === "ar" ? "المحاضرات" : "Lectures", href: "/advanced/lectures" },
                              { label: categoryName, href: `/advanced/lectures/${resolvedParams.categoryId}` },
                              { label: lectureName }
                        ]} />

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8" dir={isRtl ? "rtl" : "ltr"}>
                              {/* Main Content */}
                              <div className="lg:col-span-3">
                                    {/* Header */}
                                    <div className="mb-8">
                                          <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                                                      <FileText className="h-8 w-8 text-white" />
                                                </div>
                                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                                      {lectureName}
                                                </h1>
                                          </div>
                                    </div>

                                    {/* Summary */}
                                    {(lecture.summaryAr || lecture.summaryEn) && (
                                          <Card className="mb-8">
                                                <CardContent className="p-6">
                                                      <h2 className="text-xl font-semibold mb-4">
                                                            {language === "ar" ? "الملخص" : "Summary"}
                                                      </h2>
                                                      <p className="text-muted-foreground leading-relaxed">
                                                            {language === "ar" ? lecture.summaryAr : lecture.summaryEn || lecture.summaryAr}
                                                      </p>
                                                </CardContent>
                                          </Card>
                                    )}

                                    {/* Content */}
                                    <Card>
                                          <CardContent className="p-6">
                                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                                      <BookOpen className="h-5 w-5 text-emerald-600" />
                                                      {language === "ar" ? "محتوى المحاضرة" : "Lecture Content"}
                                                </h2>

                                                <div
                                                      className="prose prose-lg max-w-none dark:prose-invert"
                                                      dangerouslySetInnerHTML={{
                                                            __html: language === "ar"
                                                                  ? lecture.contentAr || lecture.contentEn || ""
                                                                  : lecture.contentEn || lecture.contentAr || ""
                                                      }}
                                                />
                                          </CardContent>
                                    </Card>

                                    {/* Back Button */}
                                    <div className="mt-8">
                                          <Link href={`/advanced/lectures/${resolvedParams.categoryId}`}>
                                                <Button variant="outline" className="gap-2">
                                                      {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                                                      {language === "ar" ? "العودة للمحاضرات" : "Back to Lectures"}
                                                </Button>
                                          </Link>
                                    </div>
                              </div>

                              {/* Sidebar */}
                              <div className="lg:col-span-1">
                                    <Card className="sticky top-24">
                                          <CardContent className="p-6">
                                                <h3 className="font-semibold mb-4">
                                                      {language === "ar" ? "معلومات إضافية" : "Additional Information"}
                                                </h3>

                                                <div className="space-y-4">
                                                      <div>
                                                            <p className="text-sm text-muted-foreground mb-1">
                                                                  {language === "ar" ? "الفئة" : "Category"}
                                                            </p>
                                                            <p className="text-sm font-medium">{categoryName}</p>
                                                      </div>

                                                      {lecture.documentUrl && (
                                                            <div className="pt-4 border-t">
                                                                  <Button
                                                                        onClick={handleDownload}
                                                                        className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                                                                  >
                                                                        <Download className="h-4 w-4" />
                                                                        {language === "ar" ? "تحميل المستند" : "Download Document"}
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
      )
}
