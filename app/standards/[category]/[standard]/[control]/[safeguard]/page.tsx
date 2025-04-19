"use client"

import { accessControlSafeguards, userAccessManagementTechniques } from "@/data/standards-hierarchy-data"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function SafeguardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SafeguardPageContent />
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

function SafeguardPageContent() {
  const params = useParams()
  const category = params.category as string
  const standard = params.standard as string
  const control = params.control as string
  const safeguardId = params.safeguard as string
  const { language, isRtl } = useLanguage()
  const [safeguard, setSafeguard] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const safeguardItem = accessControlSafeguards.find((s) => s.id === safeguardId)
    if (!safeguardItem) {
      notFound()
    }

    setSafeguard(safeguardItem)

    // Prefetch technique pages if this is User Access Management (A.9.2)
    if (safeguardId === "a9-2") {
      userAccessManagementTechniques.forEach((technique) => {
        router.prefetch(`/standards/${category}/${standard}/${control}/${safeguardId}/${technique.id}`)
      })
    }
  }, [category, standard, control, safeguardId, router])

  if (!safeguard) {
    return <LoadingState />
  }

  // For User Access Management (A.9.2), we'll show the techniques
  const techniques = safeguardId === "a9-2" ? userAccessManagementTechniques : []

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={`/standards/${category}/${standard}/${control}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
                {safeguard.code}
              </span>
              {safeguard.title[language]}
            </h1>
          </div>

          <div className={`prose dark:prose-invert max-w-none mb-12 ${isRtl ? "text-right" : "text-left"}`}>
            <p className="text-lg">{safeguard.description[language]}</p>
          </div>

          {safeguardId === "a9-2" && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">{language === "ar" ? "التقنيات" : "Techniques"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techniques.map((technique) => (
                  <Link
                    href={`/standards/${category}/${standard}/${control}/${safeguardId}/${technique.id}`}
                    key={technique.id}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                            {technique.code}
                          </span>
                          <span>{technique.title[language]}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={isRtl ? "text-right" : "text-left"}>
                        <p className="text-muted-foreground">{technique.description[language]}</p>
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
