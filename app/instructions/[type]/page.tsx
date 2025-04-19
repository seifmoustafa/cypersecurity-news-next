"use client"

import { instructionsData } from "@/data/instructions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function InstructionTypePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <InstructionTypeContent />
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

// Update the InstructionTypeContent function for faster loading
function InstructionTypeContent() {
  const params = useParams()
  const typeParam = params.type as string
  const { language, isRtl } = useLanguage()
  const [years, setYears] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Directly access the data without async operations
    try {
      const type = typeParam as keyof typeof instructionsData

      if (!instructionsData[type]) {
        notFound()
        return
      }

      // Get and sort the years
      const sortedYears = Object.keys(instructionsData[type]).sort((a, b) => Number(b) - Number(a))
      setYears(sortedYears)
      setIsLoading(false)

      // Prefetch year pages for faster navigation
      sortedYears.forEach((year) => {
        router.prefetch(`/instructions/${type}/${year}`)
      })
    } catch (error) {
      console.error("Error loading years:", error)
      notFound()
    }
  }, [typeParam, router])

  if (isLoading) {
    return <LoadingState />
  }

  const type = typeParam as keyof typeof instructionsData

  const typeTitle =
    {
      group: language === "ar" ? "تعليمات المجموعة" : "Group Instructions",
      branch: language === "ar" ? "تعليمات الفرع" : "Branch Instructions",
    }[type] || ""

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
            <h1 className="text-3xl font-bold text-center flex-1">{typeTitle}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {years.map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/instructions/${type}/${year}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <h3 className="text-3xl font-bold">{year}</h3>
                      <p className="text-muted-foreground mt-2">
                        {language === "ar" ? "تعليمات عام" : "Instructions for"} {year}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
