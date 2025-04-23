"use client"

import { instructionsData } from "@/data/instructions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function InstructionsYearPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <InstructionsYearContent />
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

function InstructionsYearContent() {
  const params = useParams()
  const typeParam = params.type as string
  const yearParam = params.year as string
  const { language, isRtl } = useLanguage()
  const [instructions, setInstructions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

      // Set the data and mark as loaded
      setInstructions(yearData)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading instruction data:", error)
      notFound()
    }
  }, [typeParam, yearParam])

  if (isLoading) {
    return <LoadingState />
  }

  const typeTitle =
    {
      group: language === "ar" ? "تعليمات المجموعة" : "Group Instructions",
      branch: language === "ar" ? "تعليمات الفرع" : "Branch Instructions",
    }[typeParam as keyof typeof instructionsData] || ""

  const handleInstructionClick = (instructionId: string) => {
    router.push(`/instructions/${typeParam}/${yearParam}/${instructionId}`)
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={`/instructions/${typeParam}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              {typeTitle} - {yearParam}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructions.map((instruction, index) => (
              <motion.div
                key={instruction.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleInstructionClick(instruction.id)}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                      {instruction.title[language]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-muted-foreground line-clamp-3">
                      {instruction.content[language].replace(/<[^>]*>/g, "").substring(0, 150)}...
                    </p>
                    <div className="mt-4 text-sm text-primary">
                      {language === "ar" ? "انقر للعرض" : "Click to view"}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
