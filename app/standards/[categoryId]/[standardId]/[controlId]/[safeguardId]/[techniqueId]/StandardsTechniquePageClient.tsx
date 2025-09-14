"use client"

import { useEffect, useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Shield } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { container } from "@/core/di/container"

interface StandardsTechniquePageClientProps {
  technique: {
    id: string
    name: string
    nameAr: string
    nameEn: string
    description: string
    descriptionAr: string
    descriptionEn: string
    code: string
    createdAt: string
    isActive: boolean
  }
  categoryId: string
  standardId: string
  controlId: string
  safeguardId: string
}

export default function StandardsTechniquePageClient({ technique, categoryId, standardId, controlId, safeguardId }: StandardsTechniquePageClientProps) {
  const { language, isRtl } = useLanguage()
  const [implementationSteps, setImplementationSteps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImplementationSteps = async () => {
      try {
        const stepsData = await container.standardsService.getImplementationStepsByTechniqueId(technique.id, 1, 100)
        setImplementationSteps(stepsData.data)
      } catch (error) {
        console.error("Error fetching implementation steps:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchImplementationSteps()
  }, [technique.id])

  const title = language === "ar" ? technique.nameAr || technique.nameEn : technique.nameEn || technique.nameAr
  const description = language === "ar" ? technique.descriptionAr || technique.descriptionEn : technique.descriptionEn || technique.descriptionAr

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/standards/${categoryId}/${standardId}/${controlId}/${safeguardId}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{language === "ar" ? "رجوع إلى الضمان" : "Back to Safeguard"}</span>
                </Button>
              </Link>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500/5 to-purple-600/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="font-mono text-sm">
                        {technique.code || "N/A"}
                      </Badge>
                    </div>
                    <h1 className={`text-4xl font-bold mb-4 ${isRtl ? "text-right" : "text-left"}`}>
                      {title}
                    </h1>
                    {description && (
                      <p className={`text-xl text-muted-foreground leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                        {description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-6">
                      <Badge variant="outline" className="gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(technique.createdAt).toLocaleDateString("en-US")}
                      </Badge>
                      <Badge variant={technique.isActive ? "default" : "secondary"}>
                        {technique.isActive ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "غير نشط" : "Inactive")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Steps Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{language === "ar" ? "خطوات التنفيذ" : "Implementation Steps"}</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-300 rounded-lg h-32 animate-pulse"></div>
                ))}
              </div>
            ) : implementationSteps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {implementationSteps.map((step) => (
                  <Link key={step.id} href={`/standards/${categoryId}/${standardId}/${controlId}/${safeguardId}/${technique.id}/${step.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Step {step.orderNum || "N/A"}
                          </Badge>
                        </div>
                        <h3 className="font-bold mb-2 line-clamp-2">
                          {language === "ar" ? step.nameAr || step.nameEn : step.nameEn || step.nameAr}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {language === "ar" ? step.descriptionAr || step.descriptionEn : step.descriptionEn || step.descriptionAr}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {language === "ar" ? "لا توجد خطوات تنفيذ متاحة" : "No implementation steps available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
