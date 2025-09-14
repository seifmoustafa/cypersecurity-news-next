"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronLeft, Shield, AlertCircle, Calendar, Eye, Download, Play, FileText, Image as ImageIcon, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { slugify, getLocalizedText, purifyHtml, isValidHtmlContent } from "@/lib/utils"
import { usePersonalProtectCategories } from "@/core/hooks/use-personal-protect-categories"
import { usePersonalProtectSubCategories } from "@/core/hooks/use-personal-protect-sub-categories"
import { usePersonalProtectControls } from "@/core/hooks/use-personal-protect-controls"
import { usePersonalProtectControlSteps } from "@/core/hooks/use-personal-protect-control-steps"

export default function PersonalProtectControlStepDetailPageClient() {
  const { language, isRtl } = useLanguage()
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  // Get category, sub-category, control, and step IDs from URL
  const params = useParams()
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category
  const subCategorySlug = Array.isArray(params.subcategory) ? params.subcategory[0] : params.subcategory
  const controlSlug = Array.isArray(params.control) ? params.control[0] : params.control
  const stepSlug = Array.isArray(params.step) ? params.step[0] : params.step

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

  // Fetch all steps for this control to find the one by slug
  const { steps: allSteps, loading: stepsLoading, error: stepsError, refetch: refetchSteps } = usePersonalProtectControlSteps(control?.id || "", 1, 100)
  
  // Find the step by slug
  const step = allSteps.find(s => {
    const sSlug = slugify(s.nameEn || s.name || "", s.id)
    return sSlug === stepSlug
  })

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

              {/* Step Title Card */}
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

            {/* Content Sections */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="animate-pulse space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
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
  if (!category || !subCategory || !control || !step) {
    notFound()
  }

  const categoryTitle = getLocalizedText(language, category.name, category.nameEn)
  const subCategoryTitle = getLocalizedText(language, subCategory.name, subCategory.nameEn)
  const controlTitle = getLocalizedText(language, control.name, control.nameEn)
  const stepTitle = getLocalizedText(language, step.name, step.nameEn)
  const stepSummary = getLocalizedText(language, step.summary, step.summaryEn)
  const stepContent = getLocalizedText(language, step.content, step.contentEn)
  const hasValidContent = isValidHtmlContent(stepContent)

  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/personal-protect/${categorySlug}/${subCategorySlug}/${controlSlug}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الإجراء التحكم" : "Back to Control"}</span>
                </Button>
              </Link>
            </div>

            {/* Step Title Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/5 to-green-500/10 backdrop-blur-sm">
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
                      <Badge variant="outline" className="text-sm">
                        {controlTitle}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="font-mono text-sm mb-3">
                      Step {step.order}
                    </Badge>
                    <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent ${isRtl ? "text-right" : "text-left"}`}>
                      {stepTitle}
                    </h1>
                    {stepSummary ? (
                      <div
                        className={`text-xl text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
                        dangerouslySetInnerHTML={{ __html: stepSummary }}
                      />
                    ) : (
                      <p className={`text-xl text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                        {language === "ar" ? "لا يوجد ملخص متاح" : "No summary available"}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-6">
                      <Badge variant="outline" className="gap-2 bg-background border-green-500/30 text-foreground hover:bg-green-500/10 transition-colors">
                        <Calendar className="h-3 w-3" />
                        {new Date(step.createdAt).toLocaleDateString("en-US", {
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

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Content Section */}
            {stepContent && hasValidContent && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {language === "ar" ? "المحتوى التفصيلي" : "Detailed Content"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <div
                    className={`prose prose-lg dark:prose-invert max-w-none leading-relaxed ${isRtl ? "text-right" : "text-left"} prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-green-500/30 prose-blockquote:bg-green-500/5 prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-a:text-green-600 dark:prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline`}
                    dangerouslySetInnerHTML={{ __html: stepContent }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Image Section */}
            {step.imageUrl && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {language === "ar" ? "الصورة التوضيحية" : "Illustrative Image"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10 border border-border/50 shadow-inner">
                    <Image
                      src={step.imageUrl}
                      alt={stepTitle}
                      fill
                      className="object-contain cursor-pointer hover:opacity-95 transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      onClick={() => setImageDialogOpen(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    <Button
                      variant="default"
                      size="sm"
                      className="absolute top-4 right-4 gap-2 bg-green-600 text-white hover:bg-green-700 shadow-lg border border-green-500/20 backdrop-blur-sm transition-all duration-200"
                      onClick={() => setImageDialogOpen(true)}
                    >
                      <Eye className="h-4 w-4" />
                      {language === "ar" ? "عرض كامل" : "Full View"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Section */}
            {step.videoUrl && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    {language === "ar" ? "الفيديو التعليمي" : "Instructional Video"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10 border border-border/50 shadow-inner">
                    <video
                      controls
                      className="w-full h-full object-contain"
                    >
                      <source src={step.videoUrl} type="video/mp4" />
                      {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو" : "Your browser does not support the video tag"}
                    </video>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Document Section */}
            {step.documentUrl && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${isRtl ? "text-right" : "text-left"}`}>
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {language === "ar" ? "المستند المرفق" : "Attached Document"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  {step.documentUrl && <div className="flex items-center justify-center">
                    <Button
                      variant="default"
                      size="lg"
                      className="gap-3 bg-green-600 hover:bg-green-700 text-white shadow-lg border border-green-500/20 backdrop-blur-sm transition-all duration-200"
                      onClick={() => window.open(step.documentUrl!, "_blank")}
                    >
                      <Download className="h-5 w-5" />
                      {language === "ar" ? "تحميل المستند" : "Download Document"}
                    </Button>
                  </div>}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              {stepTitle}
            </DialogTitle>
            <DialogDescription>
              {language === "ar" ? "عرض الصورة بالحجم الكامل" : "View image in full size"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <Image
              src={step.imageUrl!}
              alt={stepTitle}
              width={800}
              height={600}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              {stepTitle}
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
              <source src={step.videoUrl!} type="video/mp4" />
              {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو" : "Your browser does not support the video tag"}
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
