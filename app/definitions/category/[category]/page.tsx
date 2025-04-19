"use client"

import { getDefinitionsByCategory } from "@/data/definitions-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function DefinitionCategoryPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DefinitionCategoryContent />
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

function DefinitionCategoryContent() {
  const params = useParams()
  const categoryParam = params.category as string
  const { language, isRtl } = useLanguage()
  const [definitions, setDefinitions] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const defs = getDefinitionsByCategory(categoryParam)
    if (defs.length === 0) {
      notFound()
    }

    setDefinitions(defs)

    // Prefetch definition pages
    defs.forEach((def) => {
      router.prefetch(`/definitions/${def.id}`)
    })
  }, [categoryParam, router])

  const categoryNames = {
    general: language === "ar" ? "مصطلحات عامة" : "General Terms",
    technical: language === "ar" ? "مصطلحات تقنية" : "Technical Terms",
    legal: language === "ar" ? "مصطلحات قانونية" : "Legal Terms",
    threats: language === "ar" ? "التهديدات والهجمات" : "Threats and Attacks",
  }

  const categoryName = categoryNames[categoryParam as keyof typeof categoryNames]

  if (!categoryName) {
    return <LoadingState />
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/#standards">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">{categoryName}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {definitions.map((definition) => (
              <Link href={`/definitions/${definition.id}`} key={definition.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                      {definition.term[language]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-muted-foreground line-clamp-4">{definition.definition[language]}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
