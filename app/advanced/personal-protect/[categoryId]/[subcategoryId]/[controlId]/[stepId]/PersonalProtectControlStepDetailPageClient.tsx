"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronLeft, Shield, Calendar, Eye, Download, Play, FileText, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { getLocalizedText, purifyHtml, isValidHtmlContent } from "@/lib/utils"

interface PersonalProtectControlStepDetailPageClientProps {
  categoryId: string
  subcategoryId: string
  controlId: string
  stepId: string
  step: {
    id: string
    name: string
    nameEn: string
    summary: string
    summaryEn: string
    content: string
    contentEn: string
    imageUrl?: string
    videoUrl?: string
    documentUrl?: string
    order: number
    createdAt: string
  }
}

export default function PersonalProtectControlStepDetailPageClient({
  categoryId,
  subcategoryId,
  controlId,
  stepId,
  step,
}: PersonalProtectControlStepDetailPageClientProps) {
  const { language, isRtl } = useLanguage()
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

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
              <Link href={`/advanced/personal-protect/${categoryId}/${subcategoryId}/${controlId}`}>
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
                    {/* <div className="flex items-center gap-4 mt-6">
                      <Badge variant="outline" className="gap-2 bg-background border-green-500/30 text-foreground hover:bg-green-500/10 transition-colors">
                        <Calendar className="h-3 w-3" />
                        {new Date(step.createdAt).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </Badge>
                    </div> */}
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
