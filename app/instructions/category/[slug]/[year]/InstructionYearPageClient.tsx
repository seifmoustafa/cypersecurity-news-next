"use client"

import type { InstructionYear } from "@/core/domain/models/instruction-year"
import type { InstructionCategory } from "@/core/domain/models/instruction-category"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { FileText, Download, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InstructionYearPageClientProps {
  categorySlug: string
  yearNumber: number
  initialCategory: InstructionCategory
  initialYear: InstructionYear
}

export default function InstructionYearPageClient({
  categorySlug,
  yearNumber,
  initialCategory,
  initialYear,
}: InstructionYearPageClientProps) {
  const { language } = useLanguage()

  const categoryTitle = language === "ar" ? initialCategory.name : initialCategory.nameEn

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center">
          <Link href={`/instructions/category/${categorySlug}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">
            {language === "ar"
              ? `تعليمات ${categoryTitle} - ${yearNumber}`
              : `${categoryTitle} Instructions - ${yearNumber}`}
          </h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {language === "ar"
                ? `تعليمات الأمن السيبراني لعام ${yearNumber}`
                : `Cybersecurity Instructions for ${yearNumber}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {language === "ar" ? "تعليمات الأمن السيبراني" : "Cybersecurity Instructions"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar"
                        ? `${categoryTitle} - عام ${yearNumber}`
                        : `${categoryTitle} - Year ${yearNumber}`}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  {language === "ar"
                    ? `هذه الصفحة تحتوي على تعليمات الأمن السيبراني الخاصة بـ${categoryTitle} لعام ${yearNumber}. سيتم عرض التعليمات التفصيلية هنا قريباً.`
                    : `This page contains the cybersecurity instructions for ${categoryTitle} for the year ${yearNumber}. Detailed instructions will be displayed here soon.`}
                </p>

                <div className="flex gap-3">
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    {language === "ar" ? "تحميل التعليمات" : "Download Instructions"}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    {language === "ar" ? "عرض التفاصيل" : "View Details"}
                  </Button>
                </div>
              </div>

              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === "ar"
                    ? "محتوى التعليمات التفصيلي سيظهر هنا"
                    : "Detailed instruction content will appear here"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
