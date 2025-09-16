"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Globe, Home, Building } from "lucide-react"
import Link from "next/link"
import { container } from "@/core/di/container"
import type { StandardCategory, Standard, StandardsPaginatedResponse } from "@/core/domain/models/standard"

interface StandardsCategoryPageClientProps {
  category: StandardCategory
  initialStandards: StandardsPaginatedResponse
  initialPage: number
}

export default function StandardsCategoryPageClient({
  category,
  initialStandards,
  initialPage,
}: StandardsCategoryPageClientProps) {
  const { language, isRtl } = useLanguage()
  const router = useRouter()
  const [standards, setStandards] = useState(initialStandards)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)

  const getCategoryIcon = (categoryName?: string) => {
    const name = (categoryName ?? "").toLowerCase()
    if (name.includes("international")) return <Globe className="h-5 w-5 text-primary" />
    if (name.includes("national") || name.includes("local")) return <Home className="h-5 w-5 text-primary" />
    if (name.includes("internal")) return <Building className="h-5 w-5 text-primary" />
    return <Globe className="h-5 w-5 text-primary" />
  }

  const handleStandardClick = (standard: Standard) => {
    console.log("Standard clicked:", standard)
    // Changed: Use ID instead of slug
    const url = `/standards/${category.id}/${standard.id}`
    console.log("Navigating to:", url)
    router.push(url)
  }

  const loadPage = async (page: number) => {
    if (page === currentPage) return

    setLoading(true)
    try {
      const response = await container.standardsService.getStandardsByCategory(category.id, page, 12)
      setStandards(response)
      setCurrentPage(page)

      // Update URL without page reload
      const url = new URL(window.location.href)
      if (page === 1) {
        url.searchParams.delete("page")
      } else {
        url.searchParams.set("page", page.toString())
      }
      window.history.pushState({}, "", url.toString())
    } catch (error) {
      console.error("Error loading standards:", error)
    } finally {
      setLoading(false)
    }
  }

  // Safe access to standards data with fallbacks
  const standardsData = standards?.data || []
  const totalItems = standards?.pagination?.itemsCount || 0
  const pageSize = standards?.pagination?.pageSize || 12
  const totalPages = standards?.pagination?.pagesCount || 1

  return (
    <div className={isRtl ? "rtl" : "ltr"} dir={isRtl ? "rtl" : "ltr"}>
      <MainLayout>
        <div className="pt-36 pb-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
              <Link href="/standards">
                <Button variant="ghost" size="sm" className={`gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                  {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  <span>{language === "ar" ? "رجوع إلى المعايير" : "Back to Standards"}</span>
                </Button>
              </Link>
            </div>

            {/* Page Header */}
            <div className={`mb-12 ${isRtl ? "text-right" : "text-left"}`}>
              <div
                className={`flex items-center gap-4 mb-4 ${isRtl ? "flex-row-reverse justify-end" : "justify-start"}`}
              >
                {getCategoryIcon(category.nameEn)}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {language === "ar" ? category.nameAr : category.nameEn}
                </h1>
                <Badge variant="secondary" className="text-sm">
                  {totalItems} {language === "ar" ? "معيار" : "Standards"}
                </Badge>
              </div>
              <p
                className={`text-lg text-muted-foreground max-w-2xl ${
                  isRtl ? "text-right ml-auto" : "text-left mr-auto"
                }`}
              >
                {language === "ar"
                  ? `استعرض جميع المعايير في فئة ${category.nameAr}`
                  : `Browse all standards in the ${category.nameEn} category`}
              </p>
            </div>

            {/* Standards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : standardsData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {standardsData.map((standard, index) => (
                    <motion.div
                      key={standard.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="h-full hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                        onClick={() => handleStandardClick(standard)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className={isRtl ? "text-right" : "text-left"}>
                            {language === "ar" ? standard.nameAr : standard.nameEn}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className={isRtl ? "text-right" : "text-left"}>
                          <p
                            className={`text-muted-foreground line-clamp-3 text-sm mb-4 ${
                              isRtl ? "text-right" : "text-left"
                            }`}
                          >
                            {language === "ar" ? standard.descriptionAr : standard.descriptionEn}
                          </p>
                          <div
                            className={`flex items-center justify-between ${isRtl ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <Badge variant="secondary" className="text-xs">
                              {language === "ar" ? category.nameAr : category.nameEn}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(standard.createdAt).toLocaleDateString("en-US")}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={`flex items-center justify-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPage(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className={`gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                      <span>{language === "ar" ? "السابق" : "Previous"}</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => loadPage(pageNum)}
                            disabled={loading}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPage(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className={`gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <span>{language === "ar" ? "التالي" : "Next"}</span>
                      {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className={`text-center py-12 ${isRtl ? "text-right" : "text-left"}`}>
                <h3 className="text-lg font-semibold mb-2">
                  {language === "ar" ? "لا توجد معايير" : "No Standards Found"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "لا توجد معايير في هذه الفئة حالياً"
                    : "No standards are available in this category"}
                </p>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  )
}
