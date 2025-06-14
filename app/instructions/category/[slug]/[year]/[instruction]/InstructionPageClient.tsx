"use client"

import type { Instruction } from "@/core/domain/models/instruction"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, FileText, Download, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

interface InstructionPageClientProps {
  instruction: Instruction
  categorySlug: string
  yearNumber: number
}

export default function InstructionPageClient({ instruction, categorySlug, yearNumber }: InstructionPageClientProps) {
  const { language } = useLanguage()
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  const title = language === "ar" ? instruction.title : instruction.titleEn
  const content = language === "ar" ? instruction.content : instruction.contentEn
  const summary = language === "ar" ? instruction.summary : instruction.summaryEn

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link href={`/instructions/category/${categorySlug}/${yearNumber}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع إلى القائمة" : "Back to List"}</span>
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <article className="space-y-8">
          {/* Title and Meta */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(instruction.publishDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <FileText className="h-3 w-3 mr-1" />
                  {language === "ar" ? "تعليمات" : "Instructions"}
                </Badge>
                {instruction.isActive && <Badge variant="default">{language === "ar" ? "نشط" : "Active"}</Badge>}
              </div>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed">{summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Image */}
          {instruction.imageUrl && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{language === "ar" ? "الصورة المرفقة" : "Attached Image"}</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <img
                      src={instruction.imageUrl || "/placeholder.svg"}
                      alt={title}
                      className="w-full max-w-2xl mx-auto rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setImageDialogOpen(true)}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2 gap-1"
                      onClick={() => setImageDialogOpen(true)}
                    >
                      <Eye className="h-3 w-3" />
                      {language === "ar" ? "عرض كامل" : "Full View"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Image Dialog */}
              <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img
                      src={instruction.imageUrl || "/placeholder.svg"}
                      alt={title}
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{language === "ar" ? "المحتوى" : "Content"}</h2>
            <Card>
              <CardContent className="pt-6">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || "" }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Document Download */}
          {instruction.documentUrl && (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Download className="h-5 w-5" />
                  {language === "ar" ? "تحميل المستند" : "Download Document"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {language === "ar"
                    ? "يمكنك تحميل المستند الكامل من الرابط أدناه"
                    : "You can download the complete document from the link below"}
                </p>
                <Button className="gap-2" onClick={() => window.open(instruction.documentUrl, "_blank")}>
                  <Download className="h-4 w-4" />
                  {language === "ar" ? "تحميل المستند" : "Download Document"}
                </Button>
              </CardContent>
            </Card>
          )}

         
        </article>
      </div>
    </div>
  )
}
