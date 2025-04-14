"use client"

import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Loading } from "@/components/ui/loading"
import { useLanguage } from "@/components/language-provider"

export default function InstructionsPageClient({
  params,
  instructionData,
}: {
  params: { type: string; year: string }
  instructionData: any | null
}) {
  const type = params.type
  const year = params.year
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const { language } = useLanguage()

  useEffect(() => {
    // If we already know the instruction doesn't exist, show 404
    if (!instructionData) {
      notFound()
      return
    }

    // Set the data from props
    setData(instructionData)
    setLoading(false)
  }, [instructionData])

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center min-h-[50vh]">
              <Loading text={language === "ar" ? "جاري التحميل..." : "Loading..."} />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Show 404 if data doesn't exist
  if (!data) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/#instructions">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>رجوع</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              {type === "group" ? "تعليمات المجموعة" : "تعليمات الفرع"} - {year}
            </h1>
          </div>

          <div className="mb-8">
            <div className="prose dark:prose-invert max-w-none" dir={language === "ar" ? "rtl" : "ltr"}>
              <div dangerouslySetInnerHTML={{ __html: data.content[language] }} />
            </div>
          </div>

          {data.documentUrl && (
            <div className="flex justify-center mt-8">
              <Button onClick={() => window.open(data.documentUrl, "_blank")}>تحميل الوثيقة</Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
