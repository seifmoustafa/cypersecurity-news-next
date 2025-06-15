"use client"

import { useLanguage } from "@/components/language-provider"
import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Tag } from "lucide-react"
import type { Definition, DefinitionCategory } from "@/core/domain/models/definition"
import { slugify } from "@/lib/utils"

interface DefinitionPageClientProps {
  definition: Definition
  category: DefinitionCategory | null
}

export default function DefinitionPageClient({ definition, category }: DefinitionPageClientProps) {
  const { language, isRtl } = useLanguage()

  const displayTerm = language === "ar" ? definition.term || definition.termEn : definition.termEn || definition.term
  const displayDefinition =
    language === "ar"
      ? definition.definitionText || definition.definitionEn
      : definition.definitionEn || definition.definitionText
  const categoryName = category ? (language === "ar" ? category.name : category.nameEn) : ""
  const categorySlug = category ? slugify(category.nameEn || category.name) : ""

  const getCategorySlug = () => {
    if (!category) return "#"
    return `/definitions/category/${categorySlug}`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className={`mb-6 ${isRtl ? "text-right" : "text-left"}`}>
            <Link href={getCategorySlug()}>
              <Button variant="ghost" size="sm" className={`gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                <span>
                  {language === "ar" ? "العودة إلى" : "Back to"}{" "}
                  {categoryName || (language === "ar" ? "التعريفات" : "Definitions")}
                </span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className={`mb-8 ${isRtl ? "text-right" : "text-left"}`}>
            <h1 className="text-4xl font-bold mb-4">{displayTerm}</h1>

            {/* Meta Information - Fixed RTL alignment */}
            <div
              className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground ${isRtl ? "flex-row-reverse justify-end" : ""}`}
            >
              {category && (
                <div className={`flex items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <Tag className="h-4 w-4" />
                  <span>{categoryName}</span>
                </div>
              )}
              <div className={`flex items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}>
                <Calendar className="h-4 w-4" />
                <span>{formatDate(definition.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Definition Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Definition Summary */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className={`flex items-center gap-2 mb-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">{language === "ar" ? "التعريف" : "Definition"}</h2>
                  </div>
                  <div className={`prose dark:prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}>
                    <p className="text-lg leading-relaxed">{displayDefinition}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className={`font-semibold mb-4 ${isRtl ? "text-right" : "text-left"}`}>
                    {language === "ar" ? "معلومات إضافية" : "Additional Information"}
                  </h3>

                  <div className="space-y-4">
                    {/* Source */}
                    {definition.source && (
                      <div>
                        <dt
                          className={`text-sm font-medium text-muted-foreground mb-1 ${isRtl ? "text-right" : "text-left"}`}
                        >
                          {language === "ar" ? "المصدر" : "Source"}
                        </dt>
                        <dd className={`text-sm ${isRtl ? "text-right" : "text-left"}`}>{definition.source}</dd>
                      </div>
                    )}

                    {/* Category */}
                    {category && (
                      <div>
                        <dt
                          className={`text-sm font-medium text-muted-foreground mb-1 ${isRtl ? "text-right" : "text-left"}`}
                        >
                          {language === "ar" ? "الفئة" : "Category"}
                        </dt>
                        <dd className={`text-sm ${isRtl ? "text-right" : "text-left"}`}>
                          <Link href={getCategorySlug()}>
                            <Badge variant="secondary" className="hover:bg-primary hover:text-white transition-colors">
                              {categoryName}
                            </Badge>
                          </Link>
                        </dd>
                      </div>
                    )}

                    {/* Created Date */}
                    <div>
                      <dt
                        className={`text-sm font-medium text-muted-foreground mb-1 ${isRtl ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "تاريخ الإنشاء" : "Created Date"}
                      </dt>
                      <dd className={`text-sm ${isRtl ? "text-right" : "text-left"}`}>
                        {formatDate(definition.createdAt)}
                      </dd>
                    </div>

                    {/* Updated Date */}
                    {definition.updatedAt && (
                      <div>
                        <dt
                          className={`text-sm font-medium text-muted-foreground mb-1 ${isRtl ? "text-right" : "text-left"}`}
                        >
                          {language === "ar" ? "تاريخ التحديث" : "Updated Date"}
                        </dt>
                        <dd className={`text-sm ${isRtl ? "text-right" : "text-left"}`}>
                          {formatDate(definition.updatedAt)}
                        </dd>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
