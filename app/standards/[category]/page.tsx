"use client"

import { standardsData } from "@/data/standards-data"
import { internationalStandardsData } from "@/data/standards-hierarchy-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Suspense } from "react"

export default function StandardsCategoryPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StandardsCategoryContent />
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

function StandardsCategoryContent() {
  const params = useParams()
  const category = params.category as string
  const { language, isRtl } = useLanguage()
  const [categoryData, setCategoryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const categoryKey = category as keyof typeof standardsData
    if (!standardsData[categoryKey]) {
      notFound()
    }
    setCategoryData(standardsData[categoryKey])
    setLoading(false)

    // Prefetch related routes
    if (categoryKey === "international") {
      internationalStandardsData.forEach((standard) => {
        router.prefetch(`/standards/${categoryKey}/${standard.id}`)
      })
    }
  }, [category, router])

  if (loading) {
    return <LoadingState />
  }

  if (!categoryData) {
    return notFound()
  }

  const categoryKey = category as keyof typeof standardsData

  // For international standards, we'll show the detailed list
  const standards = categoryKey === "international" ? internationalStandardsData : []

  const categoryTitle = {
    international: language === "ar" ? "المعايير الدولية" : "International Standards",
    local: language === "ar" ? "المعايير المحلية" : "Local Standards",
    internal: language === "ar" ? "المعايير الداخلية" : "Internal Standards",
  }[categoryKey]

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
            <h1 className="text-3xl font-bold text-center flex-1">{categoryTitle}</h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-8 ${isRtl ? "text-right" : "text-left"}`}>
            {/* Extract only the current language content from the HTML */}
            {isRtl ? (
              <p>{categoryData.description.replace(/<p>.*?<\/p>/g, "").replace(/<\/?[^>]+(>|$)/g, "")}</p>
            ) : (
              <p>{categoryData.description.match(/<p>(.*?)<\/p>/)?.[1] || ""}</p>
            )}
          </div>

          {categoryKey === "international" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standards.map((standard) => (
                <Link href={`/standards/${categoryKey}/${standard.id}`} key={standard.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <Image
                        src={standard.imageUrl || "/placeholder.svg"}
                        alt={standard.title[language]}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                        {standard.title[language]}
                      </CardTitle>
                      <p className={`text-sm text-muted-foreground ${isRtl ? "text-right" : "text-left"}`}>
                        {standard.organization[language]}
                      </p>
                    </CardHeader>
                    <CardContent className={isRtl ? "text-right" : "text-left"}>
                      <p className="text-muted-foreground line-clamp-3">{standard.description[language]}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.items.map((item: any, index: number) => (
                <Card key={index} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className={isRtl ? "text-right" : "text-left"}>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
