"use client"

import { privilegedAccessImplementation, privilegedAccountSeparationDetails } from "@/data/standards-hierarchy-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function ImplementationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ImplementationPageContent />
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

function ImplementationPageContent() {
  const params = useParams()
  const category = params.category as string
  const standard = params.standard as string
  const control = params.control as string
  const safeguard = params.safeguard as string
  const technique = params.technique as string
  const implementationId = params.implementation as string
  const { language, isRtl } = useLanguage()
  const [implementation, setImplementation] = useState<any>(null)

  useEffect(() => {
    const implementationItem = privilegedAccessImplementation.find((i) => i.id === implementationId)
    if (!implementationItem) {
      notFound()
    }

    setImplementation(implementationItem)
  }, [category, standard, control, safeguard, technique, implementationId])

  if (!implementation) {
    return <LoadingState />
  }

  // For specific implementation details
  const details = implementationId === "a9-2-3-3" ? privilegedAccountSeparationDetails : null

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={`/standards/${category}/${standard}/${control}/${safeguard}/${technique}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
                {implementation.code}
              </span>
              {implementation.title[language]}
            </h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-8 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-lg">{implementation.description[language]}</p>

            <h3 className="text-xl font-bold mb-4">{language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}</h3>
            <ol className="space-y-4">
              {implementation.steps.map((step, index) => (
                <li key={index} className="flex flex-col gap-1">
                  <p className="font-medium">{step[language]}</p>
                </li>
              ))}
            </ol>
          </div>

          {details && implementationId === "a9-2-3-3" && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {language === "ar" ? "تفاصيل التنفيذ" : "Implementation Details"}
              </h2>
              <div className="bg-muted/50 rounded-lg p-6 border">
                <h3 className="text-xl font-bold mb-4">{details.title[language]}</h3>
                <p className="text-muted-foreground mb-6">{details.description[language]}</p>

                <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
                  <div dangerouslySetInnerHTML={{ __html: details.content[language] }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
