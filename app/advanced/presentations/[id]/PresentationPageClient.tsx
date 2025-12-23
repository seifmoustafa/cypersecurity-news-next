"use client"

import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Download, Calendar, FileText, Presentation } from "lucide-react"
import type { ApiPresentation } from "@/core/domain/models/media"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PresentationPageClientProps {
  presentation: ApiPresentation
}

export default function PresentationPageClient({ presentation }: PresentationPageClientProps) {
  const { t, language, isRtl } = useLanguage()
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return date.toLocaleDateString("en-US")
  }

  const handleDownload = () => {
    if (presentation.presentationUrl) {
      window.open(presentation.presentationUrl, "_blank")
      toast.success(t("presentation.downloadStarted"))
    } else {
      toast.error(t("presentation.downloadError"))
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
          <div className="container mx-auto px-4 py-8">
            <div className={`max-w-4xl mx-auto ${isRtl ? "rtl" : "ltr"}`}>
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className={`mb-6 ${isRtl ? "flex-row-reverse" : ""}`}
              >
                {isRtl ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                {t("common.back")}
              </Button>

              {/* Presentation Header */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Presentation className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{t("media.presentation")}</Badge>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {language === "ar" ? presentation.nameAr : presentation.nameEn}
                  </h1>

                  <p className="text-lg text-muted-foreground mb-6">
                    {language === "ar" ? presentation.summaryAr : presentation.summaryEn}
                  </p>

                  {/* Metadata */}
                  {/* <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(presentation.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>PowerPoint Presentation</span>
                    </div>
                  </div> */}

                  {/* Download Button */}
                  <Button onClick={handleDownload} size="lg" className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    {t("presentation.download")}
                  </Button>
                </div>

                {/* Presentation Preview */}
                <div className="w-full lg:w-80">
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                        <div className="text-center">
                          <Presentation className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">{t("presentation.previewNotAvailable")}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">PPTX</Badge>
                          <Button size="sm" onClick={handleDownload}>
                            <Download className="h-3 w-3 mr-1" />
                            {t("common.download")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className={`max-w-4xl mx-auto ${isRtl ? "rtl" : "ltr"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t("presentation.details")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">{t("presentation.title")}</h3>
                      <p className="text-muted-foreground">
                        {language === "ar" ? presentation.nameAr : presentation.nameEn}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">{t("presentation.summary")}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {language === "ar" ? presentation.summaryAr : presentation.summaryEn}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Download Action */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("common.download")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleDownload} className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      {t("presentation.download")}
                    </Button>
                  </CardContent>
                </Card>

                {/* Presentation Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("presentation.details")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t("presentation.format")}</span>
                      <Badge variant="outline">PPTX</Badge>
                    </div>
                    {/* <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t("presentation.created")}</span>
                      <span className="text-sm">{formatDate(presentation.createdAt)}</span>
                    </div> */}
                    {presentation.updatedAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t("presentation.updated")}</span>
                        <span className="text-sm">{formatDate(presentation.updatedAt)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t("presentation.status")}</span>
                      <Badge variant={presentation.isActive ? "default" : "secondary"}>
                        {presentation.isActive ? t("common.active") : t("common.inactive")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
