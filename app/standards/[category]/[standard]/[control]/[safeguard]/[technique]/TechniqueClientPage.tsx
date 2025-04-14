"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Loading } from "@/components/ui/loading"
import { ROUTES } from "@/lib/routes"

export default function TechniqueClientPage({
  params,
  technique,
  implementations,
}: {
  params: { category: string; standard: string; control: string; safeguard: string; technique: string }
  technique: any
  implementations: any[]
}) {
  const { language, isRtl } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ technique: any; implementations: any[] }>({ technique: null, implementations: [] })

  useEffect(() => {
    // Simulate data fetching to avoid hydration issues
    setLoading(true)
    setData({ technique, implementations })
    setLoading(false)
  }, [technique, implementations])

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <Loading fullPage text={language === "ar" ? "جاري التحميل..." : "Loading..."} />
        </div>
      </MainLayout>
    )
  }

  if (!data.technique) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={ROUTES.STANDARDS.SAFEGUARD(params.category, params.standard, params.control, params.safeguard)}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
                {data.technique.code}
              </span>
              {data.technique.title[language]}
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-12">
            <h2 className="text-2xl font-bold mb-4">{data.technique.title[language]}</h2>
            <p className="text-lg">{data.technique.description[language]}</p>
          </div>

          {params.technique === "a9-2-3" && data.implementations.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                {language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.implementations.map((implementation) => (
                  <Link
                    href={ROUTES.STANDARDS.IMPLEMENTATION(
                      params.category,
                      params.standard,
                      params.control,
                      params.safeguard,
                      params.technique,
                      implementation.id,
                    )}
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
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{implementation.description[language]}</p>
                        <div className="space-y-2">
                          {implementation.steps.slice(0, 2).map((step: any, index: number) => (
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
