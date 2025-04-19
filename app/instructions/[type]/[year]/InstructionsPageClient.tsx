"use client"

import { instructionsData } from "@/data/instructions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"

export default function InstructionsPageClient({
  params,
}: {
  params: { type: string; year: string }
}) {
  const type = params.type as keyof typeof instructionsData
  const year = params.year
  const { language } = useLanguage()

  if (!instructionsData[type] || !instructionsData[type][year]) {
    notFound()
  }

  const instructionData = instructionsData[type][year]

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/#instructions">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              {type === "group" ? "تعليمات المجموعة" : "تعليمات الفرع"} - {year}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="prose dark:prose-invert max-w-none" dir="rtl">
              <div dangerouslySetInnerHTML={{ __html: instructionData.ar }} />
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: instructionData.en }} />
            </div>
          </div>

          {instructionData.documentUrl && (
            <div className="flex justify-center mt-8">
              <Button onClick={() => window.open(instructionData.documentUrl, "_blank")}>تحميل الوثيقة</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
