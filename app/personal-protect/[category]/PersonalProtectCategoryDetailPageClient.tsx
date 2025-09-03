"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronLeft, Search, Users, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { slugify, getLocalizedText } from "@/lib/utils"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-sub-categories"
import { Pagination } from "@/components/ui/pagination"

export default function PersonalProtectCategoryDetailPageClient() {
  const { language, isRtl } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const pageSize = 12

  // Get category ID from URL
  const params = useParams()
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category

  // Fetch all categories to find the one by slug
  const { categories, loading: categoriesLoading, error: categoriesError } = usePersonalProtectCategories(1, 100)
  
  // Find the category by slug
  const category = categories.find(cat => {
    const catSlug = slugify(cat.nameEn || cat.name || "", cat.id)
    return catSlug === categorySlug
  })

  // Fetch sub-categories for this category
  const { 
    subCategories, 
    loading: subCategoriesLoading, 
    error: subCategoriesError, 
    pagination, 
    refetch 
  } = usePersonalProtectSubCategories(
    category?.id || "",
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

  // Loading state
  if (categoriesLoading || subCategoriesLoading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-9 w-24" />
              </div>

              {/* Category Title Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/5 to-green-500/10">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-8 w-3/4 mb-3" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mb-8">
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Content */}
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
          </div>
        </div>
      </MainLayout>
    )
  }

  // Error state
  if (categoriesError || subCategoriesError) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/personal-protect">
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع" : "Back"}</span>
                </Button>
              </Link>
            </div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{categoriesError || subCategoriesError}</AlertDescription>
            </Alert>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Not found
  if (!category) {
    notFound()
  }

  const title = getLocalizedText(language, category.name, category.nameEn)
  const description = getLocalizedText(language, category.description, category.descriptionEn)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/personal-protect">
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع" : "Back"}</span>
                </Button>
              </Link>
            </div>

            {/* Category Title Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/5 to-green-500/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className={`text-3xl font-bold mb-3 ${isRtl ? "text-right" : "text-left"}`}>
                      {title}
                    </h1>
                    <p className={`text-lg text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                      {description || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="outline" className="gap-2 bg-background border-green-500/30 text-foreground hover:bg-green-500/10 transition-colors">
                        <Calendar className="h-3 w-3" />
                        {new Date(category.createdAt).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sub Categories Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                {language === "ar" ? "الفئات الفرعية" : "Sub Categories"}
              </h2>
              {subCategories.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {pagination.itemsCount} {language === "ar" ? "فئة فرعية" : "Sub Categories"}
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "البحث في الفئات الفرعية..." : "Search sub categories..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>

            {subCategoriesLoading ? (
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
            ) : subCategoriesError ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "حدث خطأ في تحميل الفئات الفرعية" : "Error loading sub categories"}
                </h3>
                <p className="text-muted-foreground mb-4">{subCategoriesError}</p>
                <Button onClick={refetch}>
                  {language === "ar" ? "إعادة المحاولة" : "Try Again"}
                </Button>
              </div>
            ) : subCategories.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "لا توجد فئات فرعية متاحة" : "No sub categories available"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "لم يتم العثور على أي فئات فرعية تطابق بحثك"
                    : "No sub categories found matching your search"}
                </p>
              </div>
            ) : (
              <>
                {/* Sub Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {subCategories.map((subCategory, index) => {
                    const subCategorySlug = slugify(subCategory.nameEn || subCategory.name || "", subCategory.id)
                    const subTitle = getLocalizedText(language, subCategory.name, subCategory.nameEn)
                    const subDescription = getLocalizedText(language, subCategory.description, subCategory.descriptionEn)

                    return (
                      <Link href={`/personal-protect/${categorySlug}/${subCategorySlug}`} key={subCategory.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group border-l-4 border-l-green-500/20 hover:border-l-green-500">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-3">
                                <Badge variant="secondary" className="font-mono text-xs shrink-0">
                                  {subCategory.id.slice(0, 8)}
                                </Badge>
                                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                                </div>
                              </div>
                              <CardTitle className={`text-lg leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                                {subTitle}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p
                                className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                              >
                                {subDescription || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                              </p>
                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(subCategory.createdAt).toLocaleDateString("en-US", {
                                    month: "numeric",
                                    day: "numeric",
                                    year: "numeric"
                                  })}
                                </span>
                                <div className="w-2 h-2 bg-green-500/30 rounded-full group-hover:bg-green-500 transition-colors"></div>
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
                  <div className="flex justify-center mt-8">
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
      </div>
    </MainLayout>
  )
}
