"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Loading } from "@/components/ui/loading"
import { ROUTES } from "@/lib/routes"

export default function ImplementationPageClient({
  params,
  implementation,
  details,
}: {
  params: {
    category: string
    standard: string
    control: string
    safeguard: string
    technique: string
    implementation: string
  }
  implementation: any
  details: any
}) {
  const { language, isRtl } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ implementation: any; details: any }>({ implementation: null, details: null })

  useEffect(() => {
    // Simulate data fetching to avoid hydration issues
    setLoading(true)
    setData({ implementation, details })
    setLoading(false)
  }, [implementation, details])

  if (loading) {
    return (
      <MainLayout>
        <div className="pt-24 pb-16">
          <Loading fullPage text={language === "ar" ? "جاري التحميل..." : "Loading..."} />
        </div>
      </MainLayout>
    )
  }

  if (!data.implementation) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link
              href={ROUTES.STANDARDS.TECHNIQUE(
                params.category,
                params.standard,
                params.control,
                params.safeguard,
                params.technique,
              )}
            >
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>{language === "ar" ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono mr-2">
                {data.implementation.code}
              </span>
              {data.implementation.title[language]}
            </h1>
          </div>

          {/* Replace the prose section with this to only show content in the current language */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === "ar" ? data.implementation.title.ar : data.implementation.title.en}
            </h2>
            <p className="text-lg">
              {language === "ar" ? data.implementation.description.ar : data.implementation.description.en}
            </p>

            <h3 className="text-xl font-bold mb-4">{language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}</h3>
            <ol className="space-y-4">
              {data.implementation.steps.map((step: any, index: number) => (
                <li key={index} className="flex flex-col gap-1">
                  <p className="font-medium">{language === "ar" ? step.ar : step.en}</p>
                </li>
              ))}
            </ol>
          </div>

          {data.details && (
            <>
              {params.implementation === "a9-2-3-3" && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    {language === "ar" ? "تفاصيل التنفيذ" : "Implementation Details"}
                  </h2>
                  <div className="bg-muted/50 rounded-lg p-6 border">
                    <h3 className="text-xl font-bold mb-4">{data.details.title[language]}</h3>
                    <p className="text-muted-foreground mb-6">{data.details.description[language]}</p>

                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: data.details.content[language] }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
