"use client"

import { userAccessManagementTechniques, privilegedAccessImplementation } from "@/data/standards-hierarchy-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function TechniquePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TechniquePageContent />
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

function TechniquePageContent() {
  const params = useParams()
  const category = params.category as string
  const standard = params.standard as string
  const control = params.control as string
  const safeguard = params.safeguard as string
  const techniqueId = params.technique as string
  const { language, isRtl } = useLanguage()
  const [technique, setTechnique] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const techniqueItem = userAccessManagementTechniques.find((t) => t.id === techniqueId)
    if (!techniqueItem) {
      notFound()
    }

    setTechnique(techniqueItem)

    // Prefetch implementation pages if this is Management of Privileged Access Rights (A.9.2.3)
    if (techniqueId === "a9-2-3") {
      privilegedAccessImplementation.forEach((implementation) => {
        router.prefetch(
          `/standards/${category}/${standard}/${control}/${safeguard}/${techniqueId}/${implementation.id}`,
        )
      })
    }
  }, [category, standard, control, safeguard, techniqueId, router])

  if (!technique) {
    return <LoadingState />
  }

  // For Management of Privileged Access Rights (A.9.2.3), we'll show the implementation steps
  const implementations = techniqueId === "a9-2-3" ? privilegedAccessImplementation : []

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={`/standards/${category}/${standard}/${control}/${safeguard}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
                {technique.code}
              </span>
              {technique.title[language]}
            </h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-12 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-lg">{technique.description[language]}</p>
          </div>

          {techniqueId === "a9-2-3" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {implementations.map((implementation) => (
                  <Link
                    href={`/standards/${category}/${standard}/${control}/${safeguard}/${techniqueId}/${implementation.id}`}
                    key={implementation.id}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                            {implementation.code}
                          </span>
                          <span>{implementation.title[language]}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={isRtl ? "text-right" : "text-left"}>
                        <p className="text-muted-foreground mb-4">{implementation.description[language]}</p>
                        <div className="space-y-2">
                          {implementation.steps.slice(0, 2).map((step, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{step[language]}</p>
                            </div>
                          ))}
                          {implementation.steps.length > 2 && (
                            <p className="text-primary text-sm">
                              +{implementation.steps.length - 2} {language === "ar" ? "خطوات أخرى" : "more steps"}
                            </p>
                          )}
                        </div>
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
