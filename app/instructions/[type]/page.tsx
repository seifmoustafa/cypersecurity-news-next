"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { instructionsData } from "@/data/instructions-data"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InstructionsTypePage() {
  const params = useParams()
  const typeParam = params.type as string
  const { language, isRtl } = useLanguage()
  const router = useRouter()
  const [years, setYears] = useState<string[]>([])

  useEffect(() => {
    // Get the years for this instruction type
    const type = typeParam as keyof typeof instructionsData
    if (instructionsData[type]) {
      const yearsArray = Object.keys(instructionsData[type]).sort((a, b) => Number(b) - Number(a))
      setYears(yearsArray)
    } else {
      router.push("/")
    }
  }, [typeParam, router])

  const handleYearClick = (year: string) => {
    router.push(`/instructions/${typeParam}/${year}`)
  }

  const typeTitle =
    {
      group: language === "ar" ? "تعليمات المجموعة" : "Group Instructions",
      branch: language === "ar" ? "تعليمات الفرع" : "Branch Instructions",
    }[typeParam as keyof typeof instructionsData] || ""

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {years.map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleYearClick(year)}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold mb-4 text-primary">{year}</h3>
                    <p className="text-muted-foreground">
                      {language === "ar"
                        ? `تعليمات الأمن السيبراني لعام ${year}`
                        : `Cybersecurity instructions for ${year}`}
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
