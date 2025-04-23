"use client"

import { instructionsData } from "@/data/instructions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function InstructionDetailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <InstructionDetailContent />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    </MainLayout>
  )
}

function InstructionDetailContent() {
  const params = useParams()
  const typeParam = params.type as string
  const yearParam = params.year as string
  const idParam = params.id as string
  const { language, isRtl } = useLanguage()
  const [instruction, setInstruction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Immediately try to access the data without async operations
    try {
      const type = typeParam as keyof typeof instructionsData
      const typeData = instructionsData[type]

      if (!typeData) {
        notFound()
        return
      }

      const yearData = typeData[yearParam]

      if (!yearData) {
        notFound()
        return
      }

      const instructionData = yearData.find((item: any) => item.id === idParam)

      if (!instructionData) {
        notFound()
        return
      }

      // Set the data and mark as loaded
      setInstruction(instructionData)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading instruction data:", error)
      notFound()
    }
  }, [typeParam, yearParam, idParam])

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={`/instructions/${typeParam}/${yearParam}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">{instruction.title[language]}</h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-8 ${isRtl ? "text-right" : "text-left"}`}>
            <div dangerouslySetInnerHTML={{ __html: instruction.content[language] }} />
          </div>

          {instruction.documentUrl && (
            <div className="flex justify-center mt-8">
              <Button onClick={() => window.open(instruction.documentUrl, "_blank")} className="gap-2">
                <Download className="h-4 w-4" />
                {language === "ar" ? "تحميل الوثيقة" : "Download Document"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
