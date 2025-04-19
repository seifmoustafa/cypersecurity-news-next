"use client"

import { iso27001Controls, accessControlSafeguards } from "@/data/standards-hierarchy-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function ControlPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ControlPageContent />
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

function ControlPageContent() {
  const params = useParams()
  const category = params.category as string
  const standard = params.standard as string
  const controlId = params.control as string
  const { language, isRtl } = useLanguage()
  const [control, setControl] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const controlItem = iso27001Controls.find((c) => c.id === controlId)
    if (!controlItem) {
      notFound()
    }

    setControl(controlItem)

    // Prefetch safeguard pages if this is Access Control (A.9)
    if (controlId === "a9") {
      accessControlSafeguards.forEach((safeguard) => {
        router.prefetch(`/standards/${category}/${standard}/${controlId}/${safeguard.id}`)
      })
    }
  }, [category, standard, controlId, router])

  if (!control) {
    return <LoadingState />
  }

  // For Access Control (A.9), we'll show the safeguards
  const safeguards = controlId === "a9" ? accessControlSafeguards : []

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={`/standards/${category}/${standard}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
                {control.code}
              </span>
              {control.title[language]}
            </h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-12 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-lg">{control.description[language]}</p>
          </div>

          {controlId === "a9" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                {language === "ar" ? "الإجراءات الوقائية" : "Safeguards"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeguards.map((safeguard) => (
                  <Link href={`/standards/${category}/${standard}/${controlId}/${safeguard.id}`} key={safeguard.id}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                            {safeguard.code}
                          </span>
                          <span>{safeguard.title[language]}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={isRtl ? "text-right" : "text-left"}>
                        <p className="text-muted-foreground">{safeguard.description[language]}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
