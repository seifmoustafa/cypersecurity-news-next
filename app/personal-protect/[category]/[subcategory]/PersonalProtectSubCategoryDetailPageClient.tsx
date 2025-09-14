
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
import { ChevronLeft, Search, Shield, AlertCircle, Calendar, Eye, Download, Play, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { slugify, getLocalizedText } from "@/lib/utils"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-sub-categories"
import { usePersonalProtectControls } from "@/core/hooks/use-personal-protect-controls"
import { Pagination } from "@/components/ui/pagination"

export default function PersonalProtectSubCategoryDetailPageClient() {
  const { language, isRtl } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const pageSize = 12

  // Get category and sub-category IDs from URL
  const params = useParams()
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category
  const subCategorySlug = Array.isArray(params.subcategory) ? params.subcategory[0] : params.subcategory

  // Fetch all categories to find the one by slug
  const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = usePersonalProtectCategories(1, 100)
  
  // Find the category by slug
  const category = categories.find(cat => {
    const catSlug = slugify(cat.nameEn || cat.name || "", cat.id)
    return catSlug === categorySlug
  })

  // Fetch all sub-categories for this category to find the one by slug
  const { subCategories: allSubCategories, loading: subCategoriesLoading, error: subCategoriesError, refetch: refetchSubCategories } = usePersonalProtectSubCategories(category?.id || "", 1, 100)
  
  // Find the sub-category by slug
  const subCategory = allSubCategories.find(subCat => {
    const subCatSlug = slugify(subCat.nameEn || subCat.name || "", subCat.id)
    return subCatSlug === subCategorySlug
  })

  // Fetch controls for this sub-category
  const { 
    controls, 
    loading: controlsLoading, 
    error: controlsError, 
    pagination, 
    refetch: refetchControls 
  } = usePersonalProtectControls(
    subCategory?.id || "",
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
  if (categoriesLoading || subCategoriesLoading || controlsLoading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-9 w-24" />
              </div>

              {/* Sub Category Title Card */}
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
  if (categoriesError || subCategoriesError || controlsError) {
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
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {language === "ar" ? "حدث خطأ" : "Error"}
              </AlertTitle>
              <AlertDescription>
                {categoriesError || subCategoriesError || controlsError}
              </AlertDescription>
            </Alert>
            <div className="text-center mt-4">
              <Button onClick={() => {
                if (categoriesError) refetchCategories()
                if (subCategoriesError) refetchSubCategories()
                if (controlsError) refetchControls()
              }} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Not found
  if (!category || !subCategory) {
    notFound()
  }

  const categoryTitle = getLocalizedText(language, category.name, category.nameEn)
  const subCategoryTitle = getLocalizedText(language, subCategory.name, subCategory.nameEn)
  const subCategoryDescription = getLocalizedText(language, subCategory.description, subCategory.descriptionEn)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/personal-protect/${categorySlug}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الفئة" : "Back to Category"}</span>
                </Button>
              </Link>
            </div>

            {/* Sub Category Title Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/5 to-green-500/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="text-sm">
                        {categoryTitle}
                      </Badge>
                    </div>
                    <h1 className={`text-3xl font-bold mb-3 ${isRtl ? "text-right" : "text-left"}`}>
                      {subCategoryTitle}
                    </h1>
                    <p className={`text-lg text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                      {subCategoryDescription || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="outline" className="gap-2 bg-background border-green-500/30 text-foreground hover:bg-green-500/10 transition-colors">
                        <Calendar className="h-3 w-3" />
                        {new Date(subCategory.createdAt).toLocaleDateString("en-US", {
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

          {/* Controls Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                {language === "ar" ? "إجراءات التحكم" : "Controls"}
              </h2>
              {controls.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {pagination.itemsCount} {language === "ar" ? "إجراء التحكم" : "Controls"}
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "البحث في إجراءات التحكم..." : "Search controls..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>

            {controlsLoading ? (
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
            ) : controlsError ? (
              <div className="text-center py-8">
                <Alert variant="destructive" className="max-w-md mx-auto mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {language === "ar" ? "حدث خطأ في تحميل إجراءات التحكم" : "Error loading controls"}
                  </AlertDescription>
                </Alert>
                <Button onClick={refetchControls} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {language === "ar" ? "إعادة المحاولة" : "Try Again"}
                </Button>
              </div>
            ) : controls.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "لا توجد ضوابط متاحة" : "No controls available"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "لم يتم العثور على أي ضوابط تطابق بحثك"
                    : "No controls found matching your search"}
                </p>
              </div>
            ) : (
              <>
                {/* Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {controls.map((control) => {
                    const controlSlug = slugify(control.nameEn || control.name || "", control.id)
                    const controlTitle = getLocalizedText(language, control.name, control.nameEn)
                    const controlDescription = getLocalizedText(language, control.description, control.descriptionEn)
                    
                    return (
                      <Link key={control.id} href={`/personal-protect/${categorySlug}/${subCategorySlug}/${controlSlug}`}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 group border-l-4 border-l-green-500/20 hover:border-l-green-500">
                          {/* Image Preview */}
                          {control.imageUrl && (
                            <div className="relative h-32 overflow-hidden rounded-t-lg">
                              <Image
                                src={control.imageUrl}
                                alt={controlTitle}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="pb-3">
                            <CardTitle className={`text-lg leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                              {controlTitle}
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <p className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}>
                              {controlDescription || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                            </p>
                            
                            <div className="mt-4 flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {language === "ar" ? "عرض التفاصيل" : "View Details"}
                              </Badge>
                              <div className="w-2 h-2 bg-green-500/30 rounded-full group-hover:bg-green-500 transition-colors"></div>
                            </div>
                          </CardContent>
                        </Card>
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