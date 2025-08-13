"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { useAwarenessYears, useAwarenessByYearId } from "@/core/hooks/use-awareness"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight, ArrowLeft, Calendar, Download, FileText } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { slugify } from "@/lib/utils"
import MainLayout from "@/components/layouts/main-layout"

interface AwarenessYearPageClientProps {
  year: string
}

export default function AwarenessYearPageClient({ year }: AwarenessYearPageClientProps) {
  const { language, isRtl } = useLanguage()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [yearId, setYearId] = useState<string>("")
  const pageSize = 12

  // First, get all years to find the yearId for the given year
  const { data: yearsData } = useAwarenessYears("", 1, 100)

  // Find the yearId for the given year
  useEffect(() => {
    if (yearsData && yearsData.data.length > 0) {
      const foundYear = yearsData.data.find((y) => y.year.toString() === year)
      if (foundYear) {
        setYearId(foundYear.id)
      }
    }
  }, [yearsData, year])

  // Get awareness data for the specific year
  const { data, loading, error } = useAwarenessByYearId(yearId, search, page, pageSize)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const getDisplayTitle = (item: any) => {
    return language === "ar" ? item.title || item.titleEn || "" : item.titleEn || item.title || ""
  }

  const getDisplaySummary = (item: any) => {
    return language === "ar" ? item.summary || item.summaryEn || "" : item.summaryEn || item.summary || ""
  }

  const getSlug = (item: any) => {
    const englishTitle = item.titleEn || item.title || ""
    return slugify(englishTitle, item.id)
  }

  const handleDownload = (documentUrl: string, title: string) => {
    if (documentUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || ""
      const fullUrl = `${baseUrl}${documentUrl}`

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = fullUrl
      link.download = `${title}.pdf`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {language === "ar" ? "خطأ في تحميل البيانات" : "Error Loading Data"}
            </h1>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!yearId && yearsData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {language === "ar" ? "السنة غير موجودة" : "Year Not Found"}
            </h1>
            <p className="text-gray-600 mb-4">
              {language === "ar" ? `لا يمكن العثور على السنة ${year}` : `Cannot find year ${year}`}
            </p>
            <Link href="/awareness/years">
              <Button>{language === "ar" ? "عرض جميع السنوات" : "View All Years"}</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button to Years Page */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/awareness/years")} className="flex items-center gap-2">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {language === "ar" ? "العودة للسنوات" : "Back to Years"}
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === "ar" ? `التوعية الأمنية - ${year}` : `Security Awareness - ${year}`}
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            {language === "ar"
              ? `استعرض محتوى التوعية الأمنية لعام ${year}`
              : `Browse security awareness content for year ${year}`}
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} h-4 w-4 text-gray-400`} />
            <Input
              placeholder={language === "ar" ? "البحث في المحتوى..." : "Search content..."}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className={`${isRtl ? "pr-10" : "pl-10"}`}
            />
          </div>
        </div>

        {/* Content */}
        {loading || !yearId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 group">
                    {/* Document Icon instead of Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                      <div
                        className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} bg-primary text-white text-xs px-2 py-1 rounded`}
                      >
                        {item.year || year}
                      </div>
                      {item.documentUrl && (
                        <Button
                          size="sm"
                          className={`absolute bottom-2 ${isRtl ? "left-2" : "right-2"} opacity-0 group-hover:opacity-100 transition-opacity`}
                          onClick={(e) => {
                            e.preventDefault()
                            handleDownload(item.documentUrl!, getDisplayTitle(item))
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {getDisplayTitle(item)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{getDisplaySummary(item)}</p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Link href={`/awareness/${year}/${getSlug(item)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            {language === "ar" ? "اقرأ المزيد" : "Read More"}
                          </Button>
                        </Link>
                        {item.documentUrl && (
                          <Button
                            size="sm"
                            onClick={() => handleDownload(item.documentUrl!, getDisplayTitle(item))}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            {language === "ar" ? "تحميل" : "Download"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.pagesCount > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                  {language === "ar" ? "السابق" : "Previous"}
                </Button>
                <span className="flex items-center px-4">
                  {language === "ar"
                    ? `صفحة ${page} من ${data.pagination.pagesCount}`
                    : `Page ${page} of ${data.pagination.pagesCount}`}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(data.pagination.pagesCount, page + 1))}
                  disabled={page === data.pagination.pagesCount}
                >
                  {language === "ar" ? "التالي" : "Next"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {language === "ar" ? "لا يوجد محتوى متاح" : "No Content Available"}
            </h2>
            <p className="text-gray-500">
              {language === "ar"
                ? `لا يوجد محتوى توعية أمنية لعام ${year}`
                : `No security awareness content for year ${year}`}
            </p>
            <Link href="/awareness/years" className="mt-4 inline-block">
              <Button variant="outline">{language === "ar" ? "عرض جميع السنوات" : "View All Years"}</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
