"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Loading } from "@/components/ui/loading"
import { ROUTES } from "@/lib/routes"

export default function SafeguardClientPage({
  params,
  safeguard,
  techniques,
}: {
  params: { category: string; standard: string; control: string; safeguard: string }
  safeguard: any
  techniques: any[]
}) {
  const { language, isRtl } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ safeguard: any; techniques: any[] }>({ safeguard: null, techniques: [] })

  useEffect(() => {
    // Simulate data fetching to avoid hydration issues
    setLoading(true)
    setData({ safeguard, techniques })
    setLoading(false)
  }, [safeguard, techniques])

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <Loading fullPage text={language === "ar" ? "جاري التحميل..." : "Loading..."} />
        </div>
      </MainLayout>
    )
  }

  if (!data.safeguard) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href={ROUTES.STANDARDS.CONTROL(params.category, params.standard, params.control)}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
                {data.safeguard.code}
              </span>
              {data.safeguard.title[language]}
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-12">
            <h2 className="text-2xl font-bold mb-4">{data.safeguard.title[language]}</h2>
            <p className="text-lg">{data.safeguard.description[language]}</p>
          </div>

          {params.safeguard === "a9-2" && data.techniques.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">{language === "ar" ? "التقنيات" : "Techniques"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.techniques.map((technique) => (
                  <Link
                    href={ROUTES.STANDARDS.TECHNIQUE(
                      params.category,
                      params.standard,
                      params.control,
                      params.safeguard,
                      technique.id,
                    )}
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
                      <CardContent>
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
