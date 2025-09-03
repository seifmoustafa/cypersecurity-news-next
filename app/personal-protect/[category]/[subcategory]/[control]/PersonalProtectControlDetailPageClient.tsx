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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronLeft, Search, Shield, AlertCircle, Calendar, Eye, Download, Play, List, FileText, Image as ImageIcon, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { slugify, getLocalizedText, purifyHtml, isValidHtmlContent } from "@/lib/utils"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-sub-categories"
import { usePersonalProtectControls } from "@/core/hooks/use-personal-protect-controls"
import { usePersonalProtectControlSteps } from "@/core/hooks/use-personal-protect-control-steps"
import { Pagination } from "@/components/ui/pagination"

export default function PersonalProtectControlDetailPageClient() {
  const { language, isRtl } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("")
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>("")
  const pageSize = 12

  // Get category, sub-category, and control IDs from URL
  const params = useParams()
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category
  const subCategorySlug = Array.isArray(params.subcategory) ? params.subcategory[0] : params.subcategory
  const controlSlug = Array.isArray(params.control) ? params.control[0] : params.control

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

  // Fetch all controls for this sub-category to find the one by slug
  const { controls: allControls, loading: controlsLoading, error: controlsError, refetch: refetchControls } = usePersonalProtectControls(subCategory?.id || "", 1, 100)
  
  // Find the control by slug
  const control = allControls.find(ctrl => {
    const ctrlSlug = slugify(ctrl.nameEn || ctrl.name || "", ctrl.id)
    return ctrlSlug === controlSlug
  })

  // Fetch steps for this control
  const { 
    steps, 
    loading: stepsLoading, 
    error: stepsError, 
    pagination, 
    refetch: refetchSteps 
  } = usePersonalProtectControlSteps(
    control?.id || "",
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

  const handleVideoOpen = (videoUrl: string, title: string) => {
    setSelectedVideoUrl(videoUrl)
    setSelectedVideoTitle(title)
    setVideoDialogOpen(true)
  }

  // Loading state
  if (categoriesLoading || subCategoriesLoading || controlsLoading || stepsLoading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-9 w-24" />
              </div>

              {/* Control Title Card */}
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
  if (categoriesError || subCategoriesError || controlsError || stepsError) {
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
                {categoriesError || subCategoriesError || controlsError || stepsError}
              </AlertDescription>
            </Alert>
            <div className="text-center mt-4">
              <Button onClick={() => {
                if (categoriesError) refetchCategories()
                if (subCategoriesError) refetchSubCategories()
                if (controlsError) refetchControls()
                if (stepsError) refetchSteps()
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
  if (!category || !subCategory || !control) {
    notFound()
  }

  const categoryTitle = getLocalizedText(language, category.name, category.nameEn)
  const subCategoryTitle = getLocalizedText(language, subCategory.name, subCategory.nameEn)
  const controlTitle = getLocalizedText(language, control.name, control.nameEn)
  const controlDescription = getLocalizedText(language, control.description, control.descriptionEn)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/personal-protect/${categorySlug}/${subCategorySlug}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الفئة الفرعية" : "Back to Sub Category"}</span>
                </Button>
              </Link>
            </div>

            {/* Control Title Card */}
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
                      <Badge variant="outline" className="text-sm">
                        {subCategoryTitle}
                      </Badge>
                    </div>
                    <h1 className={`text-3xl font-bold mb-3 ${isRtl ? "text-right" : "text-left"}`}>
                      {controlTitle}
                    </h1>
                    <p className={`text-lg text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                      {controlDescription || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="outline" className="gap-2 bg-background border-green-500/30 text-foreground hover:bg-green-500/10 transition-colors">
                        <Calendar className="h-3 w-3" />
                        {new Date(control.createdAt).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </Badge>
                    </div>
                  </div>
                  {control.imageUrl && (
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-green-200 dark:border-green-800">
                        <Image
                          src={control.imageUrl}
                          alt={controlTitle}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Steps Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <List className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
              </h2>
              {steps.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {pagination.itemsCount} {language === "ar" ? "خطوة" : "Steps"}
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === "ar" ? "البحث في الخطوات..." : "Search steps..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </form>
            </div>

            {stepsLoading ? (
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
            ) : stepsError ? (
              <div className="text-center py-8">
                <Alert variant="destructive" className="max-w-md mx-auto mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {language === "ar" ? "حدث خطأ في تحميل الخطوات" : "Error loading steps"}
                  </AlertDescription>
                </Alert>
                <Button onClick={refetchSteps} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {language === "ar" ? "إعادة المحاولة" : "Try Again"}
                </Button>
              </div>
            ) : steps.length === 0 ? (
              <div className="text-center py-8">
                <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "لا توجد خطوات متاحة" : "No steps available"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "لم يتم العثور على أي خطوات تطابق بحثك"
                    : "No steps found matching your search"}
                </p>
              </div>
            ) : (
              <>
                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {steps.map((step, index) => {
                    const stepSlug = slugify(step.nameEn || step.name || "", step.id)
                    const stepTitle = getLocalizedText(language, step.name, step.nameEn)
                    const stepSummary = getLocalizedText(language, step.summary, step.summaryEn)
                    const hasValidContent = isValidHtmlContent(getLocalizedText(language, step.content, step.contentEn))
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 group border-l-4 border-l-green-500/20 hover:border-l-green-500">
                          {/* Image Preview */}
                          {step.imageUrl && (
                            <div className="relative h-32 overflow-hidden rounded-t-lg">
                              <Image
                                src={step.imageUrl}
                                alt={stepTitle}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <Badge variant="secondary" className="font-mono text-xs shrink-0">
                                Step {step.order}
                              </Badge>
                            </div>
                            <CardTitle className={`text-lg leading-tight ${isRtl ? "text-right" : "text-left"}`}>
                              {stepTitle}
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            {hasValidContent ? (
                              <div 
                                className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}
                                dangerouslySetInnerHTML={{ 
                                  __html: getLocalizedText(language, step.content, step.contentEn) 
                                }}
                              />
                            ) : (
                              <p className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${isRtl ? "text-right" : "text-left"}`}>
                                {stepSummary || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                              </p>
                            )}
                            
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {language === "ar" ? `الخطوة ${step.order}` : `Step ${step.order}`}
                              </span>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-4 flex items-center gap-2">
                              <Link
                                href={`/personal-protect/${categorySlug}/${subCategorySlug}/${controlSlug}/${stepSlug}`}
                                className="flex-1"
                              >
                                <Button variant="default" size="sm" className="w-full gap-1">
                                  <Eye className="h-3 w-3" />
                                  {language === "ar" ? "عرض" : "View"}
                                </Button>
                              </Link>
                              
                              {step.videoUrl && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleVideoOpen(step.videoUrl!, stepTitle)
                                  }}
                                >
                                  <Play className="h-3 w-3" />
                                  {language === "ar" ? "فيديو" : "Video"}
                                </Button>
                              )}
                              
                              {step.documentUrl && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    window.open(step.documentUrl!, "_blank")
                                  }}
                                >
                                  <Download className="h-3 w-3" />
                                  {language === "ar" ? "تحميل" : "Download"}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
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

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              {selectedVideoTitle}
            </DialogTitle>
            <DialogDescription>
              {language === "ar" ? "مشاهدة الفيديو التعليمي" : "Watch the instructional video"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <video
              controls
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: "70vh" }}
            >
              <source src={selectedVideoUrl} type="video/mp4" />
              {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو" : "Your browser does not support the video tag"}
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
