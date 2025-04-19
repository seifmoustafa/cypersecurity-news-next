"use client"

import { frameworkData } from "@/data/standards-hierarchy-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Suspense } from "react"

export default function FrameworkDomainPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <FrameworkDomainContent />
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

function FrameworkDomainContent() {
  const params = useParams()
  const domainId = params.domain as string
  const { language, isRtl } = useLanguage()
  const [domain, setDomain] = useState<any>(null)

  useEffect(() => {
    const domainItem = frameworkData.domains.find((d) => d.id === domainId)
    if (!domainItem) {
      notFound()
    }
    setDomain(domainItem)
  }, [domainId])

  if (!domain) {
    return <LoadingState />
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/framework">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">{domain.title[language]}</h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-12 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-lg">{domain.description[language]}</p>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">{language === "ar" ? "المكونات" : "Components"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domain.components.map((component) => (
              <Card key={component.id} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                    {component.title[language]}
                  </CardTitle>
                </CardHeader>
                <CardContent className={isRtl ? "text-right" : "text-left"}>
                  <p className="text-muted-foreground mb-4">{component.description[language]}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
