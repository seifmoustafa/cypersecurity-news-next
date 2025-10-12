"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { useAwarenessYears } from "@/core/hooks/use-awareness"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"

export default function AwarenessYearsPageClient() {
  const { language, isRtl } = useLanguage()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 100

  const { data, loading, error } = useAwarenessYears(search, page, pageSize)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button to Homepage Awareness Section */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/advanced#awareness")} className="flex items-center gap-2">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">
              {language === "ar" ? "سنوات التوعية الأمنية" : "Security Awareness Years"}
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            {language === "ar" ? "استعرض محتوى التوعية الأمنية حسب السنة" : "Browse security awareness content by year"}
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} h-4 w-4 text-gray-400`} />
            <Input
              placeholder={language === "ar" ? "البحث في السنوات..." : "Search years..."}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className={`${isRtl ? "pr-10" : "pl-10"}`}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 bg-gray-300 rounded-full w-12 mx-auto mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {language === "ar" ? "خطأ في تحميل البيانات" : "Error Loading Data"}
            </h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>{language === "ar" ? "إعادة المحاولة" : "Retry"}</Button>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.data.map((year, idx) => (
                <motion.div
                  key={year.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link href={`/advanced/awareness/${year.year}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50 group">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <Calendar className="h-12 w-12 mx-auto text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{year.year}</h3>
                        <Badge variant={year.isActive ? "default" : "secondary"} className="mb-4">
                          {year.isActive
                            ? language === "ar"
                              ? "نشط"
                              : "Active"
                            : language === "ar"
                              ? "غير نشط"
                              : "Inactive"}
                        </Badge>
                        <div className="flex items-center justify-center text-primary text-sm font-medium">
                          {language === "ar" ? "عرض المحتوى" : "View Content"}
                          <ArrowRight
                            className={`h-4 w-4 ${isRtl ? "mr-1 rotate-180" : "ml-1"} group-hover:translate-x-1 transition-transform`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {language === "ar" ? "لا توجد سنوات متاحة" : "No Years Available"}
            </h2>
            <p className="text-gray-500">
              {language === "ar" ? "لم يتم العثور على أي سنوات للتوعية الأمنية" : "No security awareness years found"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
