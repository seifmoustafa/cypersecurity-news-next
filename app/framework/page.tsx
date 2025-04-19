"use client"

import { frameworkData } from "@/data/standards-hierarchy-data"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function FrameworkPage() {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    // Prefetch domain pages
    frameworkData.domains.forEach((domain) => {
      router.prefetch(`/framework/${domain.id}`)
    })
  }, [router])

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === "ar" ? "إطار عمل الأمن السيبراني" : "Cybersecurity Framework"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === "ar"
                ? "نموذج شامل لإدارة وتنفيذ الأمن السيبراني"
                : "Comprehensive model for managing and implementing cybersecurity"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworkData.domains.map((domain) => (
              <Link href={`/framework/${domain.id}`} key={domain.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                      {domain.title[language]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-muted-foreground mb-4">{domain.description[language]}</p>
                    <div className="space-y-2">
                      {domain.components.map((component) => (
                        <div key={component.id} className="p-2 bg-muted rounded-md">
                          <p className="font-medium">{component.title[language]}</p>
                        </div>
                      ))}
                    </div>
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
