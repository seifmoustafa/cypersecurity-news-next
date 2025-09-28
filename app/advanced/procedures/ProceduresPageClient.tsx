"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Search, FileText } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { getLocalizedText } from "@/lib/utils"
import { useProcedures } from "@/core/hooks/use-procedures"
import { Pagination } from "@/components/ui/pagination"

export default function ProceduresPageClient() {
  const { language, isRtl } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const pageSize = 12

  const { procedures, loading, error, pagination, refetch } = useProcedures(
    currentPage,
    pageSize,
    debouncedSearchTerm
  )

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to first page when searching
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setDebouncedSearchTerm(searchTerm)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/#security-requirements">
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع" : "Back"}</span>
                </Button>
              </Link>
            </div>

            {/* Page Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-3">
                {language === "ar" ? "تأمين البنية التحتية المعلوماتية لجهات ق.م" : "General Procedures"}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "ar"
                  ? "تأمين البنية التحتية المعلوماتية لجهات ق.م التي تنطبق على جميع المستخدمين والأنظمة"
                  : "General cybersecurity procedures that apply to all users and systems"}
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "البحث في الإجراءات..." : "Search procedures..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="h-48">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-5 bg-muted rounded w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {language === "ar" ? "حدث خطأ في تحميل الإجراءات" : "Error loading procedures"}
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refetch}>
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </Button>
            </div>
          ) : procedures.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {language === "ar" ? "لا توجد إجراءات متاحة" : "No procedures available"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "لم يتم العثور على أي إجراءات تطابق بحثك"
                  : "No procedures found matching your search"}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? `تم العثور على ${pagination.itemsCount} إجراء`
                    : `${pagination.itemsCount} procedures found`}
                </p>
                <Badge variant="outline">
                  {language === "ar" ? `الصفحة ${currentPage} من ${pagination.pagesCount}` : `Page ${currentPage} of ${pagination.pagesCount}`}
                </Badge>
              </div>

              {/* Procedures Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {procedures.map((procedure, index) => {
                  const title = getLocalizedText(language, procedure.nameAr, procedure.nameEn)
                  const description = getLocalizedText(language, procedure.descriptionAr, procedure.descriptionEn)

                  return (
                    <Link href={`/advanced/procedures/${procedure.id}`} key={procedure.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <Badge variant="secondary" className="font-mono text-xs shrink-0">
                                {procedure.id.slice(0, 8)}
                              </Badge>
                              <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                              </div>
                            </div>
                            <CardTitle className={`text-lg leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                              {title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p
                              className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                            >
                              {description || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                            </p>
                                                         <div className="mt-4 flex items-center justify-between">
                               <span className="text-xs text-muted-foreground">
                                 {new Date(procedure.createdAt).toLocaleDateString("en-US", {
                                   month: "numeric",
                                   day: "numeric",
                                   year: "numeric"
                                 })}
                               </span>
                              <div className="w-2 h-2 bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {pagination.pagesCount > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.pagesCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
